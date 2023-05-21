import { io } from "../server.js";
import { VIEWS } from "../views/views.js";
import { User } from "../models/user_model.js";
import { Room } from "../models/room_model.js";
import { hashData } from "../utilities/hash-data.js";
import { verifyHashData } from "../utilities/verify_hash_data.js";
import { ROUTES } from "../routes/routes.js";

function getUserHome(request,response){
    if(!request.session || !request.session.user){
        response.redirect(ROUTES.GET.LOGIN);
    }else{
        const { user } = request.session;
        response.status(200).render(VIEWS.HOME, { user });
    }
};
function getUserRoom(request,response){
    if(!request.session || !request.session.user){
        response.redirect(ROUTES.GET.LOGIN);
    }else{
        response.status(200).render(VIEWS.ROOM);
    }  
};
async function createRoom(request,response){
    try{
        const { room, passkey } = request.body;
        const session = request.session;

        // check if room exists already
        const existing_room = await Room.findOne( { name: room });

        if(existing_room){
            // I need to handle this differently
            return response.status(401).json({
                title: `Name Temporary unavailable`,
                message: `It is unlikley but someone else has used this name. It is temporarily unavailable`,
                instructions: `Please try a different name.`,
                success: false
            });
        }else{

            const hashed_key = await hashData(passkey);
            const new_room = new Room({ 
                name: room, 
                passkey: hashed_key
            });
            const created_room = await new_room.save();
            created_room.users.push({ username: session.user.username });
            await created_room.save();

            // setting room on session to compare in case of disconnect
            // This may cause a problem....
            session.room = room;

            // socket
            io.on('connection', (socket)=>{
                socket.admin = true;
                socket.rid = created_room._id;
                socket.room = session.room;
                socket.user = session.user.username;
            });

            return response.status(200).redirect(ROUTES.GET.ROOM);
        }
    }catch(error){
        response.render(VIEWS.ERROR, { 
            success: false, 
            message: error.message 
        });
    }
};
async function joinRoom(request,response){
    try{
        const { room, passkey } = request.body;
        const session = request.session;

        // check if room exists
        const existing_room = await Room.findOne({ name: room });

        if(!existing_room){
            // if non-exists, return response
            return response.status(401).json({
                title: `Invalid room name or passkey`,
                message: `Either the name or passkey is wrong. I'm sorry I can't tell you which.`,
                instructions: `You're gonna have to just try again.`,
                success: false
            });
        }else{
            const stored_hashed_string = existing_room.passkey
            const is_string_valid = await verifyHashData(passkey, stored_hashed_string)
            
            if(!is_string_valid){
                return response.status(401).json({
                    title: `Invalid room name or passkey`,
                    message: `Either the name or passkey is wrong. I'm sorry I can't tell you which.`,
                    instructions: `You're gonna have to just try again.`,
                    success: false
                });
            }else{
                
                //I need to limit the amount of users in each room to be only two
                if(existing_room.users.length === 2){
                   return response.status(401).json({
                        title: `No access`,
                        message: `Sorry but you have no access to this room.`,
                        instructions: `It is possible to create your own room...`,
                        success: false
                   });

                }else{
                    existing_room.users.push({ username: session.user.username });
                    await existing_room.save();

                    io.on('connection', (socket)=>{
                        socket.admin = false;
                        socket.room = room;
                        socket.user = session.user.username;
                        socket.rid = existing_room._id;
                    });

                    return response.status(200).redirect(ROUTES.GET.ROOM);
                }
            }
        } 
    }catch(error){
        response.render(VIEWS.ERROR, { 
            success: false, 
            message: error.message 
        });
    }
};
async function saveChatMessageData(socket,data){
    try{
        const existing_room = await Room.findOne({ _id: socket.rid });

        existing_room.messages.push({
            admin: data.admin,
            message: data.message,
            time:data.time,
            translate: data.translate,
            translation: data.translation,
            username: data.username,
        });
        existing_room.save();
        
    }catch(error){
        socket.emit('server-error',{
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `I'm sorry but your message was not saved.`
        })
    }
};
async function saveChatImageData(socket, data){
    try{

        const existing_room = await Room.findOne({ _id: socket.rid });

        existing_room.images.push({
            admim: data.admin,
            imageData: data.imageData,
            time: data.time,
            username: data.username
        });
        existing_room.save();

    }catch(error){
        socket.emit('server-error',{
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `I'm sorry but your image wasn't saved.`
        });
    }
}
async function getRoomDataForSocket(socket){
    try{

        const existing_room = await Room.findOne({ _id: socket.rid });

        if(existing_room.messages.length === 0 && existing_room.images.length === 0){
            return false;
        }else{

            const all_messages = [];
            if(existing_room.messages.length > 0){
                existing_room.messages.forEach( message => {
                    all_messages.push(message);
                });
            }
            if(existing_room.images.length > 0){
                existing_room.images.forEach( image => {
                    all_messages.push(image);
                });
            }
            
            all_messages.sort( (a,b) => a.time - b.time);

            return all_messages;
        }
    }catch(error){
        return false;
    }
};
async function userLeaveRoom(io,socket){

    const roomId = socket.rid;
    const username = socket.user;

    try{

        const existing_room = await Room.findOne({ _id: roomId });

        if(!existing_room){
            throw new Error('Room does not exist to leave from: userLeaveRoom function')
        }

        const usersBefore = existing_room.users.length;
        existing_room.users = existing_room.users.filter( user => user.username !== username );
        const usersAfter = existing_room.users.length;

        if(usersAfter === 0){
            // No users left, delete room object
            await Room.deleteOne({ _id: roomId });

        }else if(usersBefore !== usersAfter){
            // if the user was removed, save the update room
            await existing_room.save();
        }else{
            io.to(socket.id).emit('server-error', {
                title: `Deletion error.`,
                message: `${socket.user} not found in database to be removed`,
                instructions: `As the developer, I have no idea how to handle this.`
            });
        }
    }catch(error){
        io.to(socket.id).emit('server-error', {
            title: `Server Error.`,
            message: `There was an on the server.`,
            instructions: `Please try again.`
        });
    }
};
async function userLogout(request,response){
    try{
        // I need to send errors via response to client
        if(request.session){

            request.session.authenticated = false;

            const session_id = request.session.id;
            const session_store = request.sessionStore;
            const USER_ID = request.session.user.userId;

            session_store.destroy(session_id, (error)=>{
                if(error){
                    throw error;
                }
            })
            
            // === I need to check this and send and error if it fails ===
            await User.updateOne({ _id: USER_ID }, { active: false });

            request.session.destroy((error)=>{
                if(error){
                   throw error;
                }
            });

            response.clearCookie('user-session').redirect(ROUTES.GET.INDEX);
        }  
    }catch(error){
        response.render(ROUTES.GET.ERROR, { 
            success: false, 
            message: error.message
        });
    }
};

export { 
    getUserHome, 
    getUserRoom, 
    createRoom, 
    joinRoom,
    saveChatMessageData,
    saveChatImageData,
    getRoomDataForSocket,
    userLeaveRoom, 
    userLogout 
};