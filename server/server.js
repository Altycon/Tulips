import { connectDatabase } from './config/database.js';
import express from 'express';
import * as env from 'dotenv';
import helmet from 'helmet'; 
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { userSessionOptions } from './config/session.js';

import { ROUTES } from './routes/routes.js';
import { indexRouter } from './routes/index_router.js';
import { authRouter } from './routes/auth_router.js';
import { userRouter } from './routes/user_router.js';
import { errorApplicationMiddleware } from './middleware/error_application_middleware.js';

import { translateText } from './translation/translate.js';

import { 
    checkSocketChatMessageData,
    checkSocketTranslateMessageData
} from './controllers/socket_controller.js';

import { 
    saveChatMessageData,
    saveChatImageData, 
    getRoomDataForSocket, 
    userLeaveRoom 
} from './controllers/user_controller.js';

connectDatabase();
env.config();

const port = process.env.PORT || 3000;
const origin = process.env.NODE_ENV === 'production' ? process.env.HOST_URL:`http://localhost:3000`

const App = express();
const server = createServer(App);
const io = new Server(server, { 
    allowEIO3: true, // allowEI03 allows access to request object in socket
    cors: {
        origin: origin,
    }
});

App.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views'));
App.set('view engine', 'ejs');

App.use(express.static('client'));
App.use('/favicon.ico', express.static('img/icons/favicon.ico'));

// request and response header security
App.use(compression());
App.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
}));
App.use(cors({
    origin: origin,
    credentials: true
}));

// handling user form requests for request.body
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

App.set('trust proxy', 1);
App.use(session(userSessionOptions))

App.use(ROUTES.GET.INDEX, indexRouter);
App.use(ROUTES.GET.AUTH, authRouter);
App.use(ROUTES.GET.USER, userRouter);

App.use(errorApplicationMiddleware);

App.get(ROUTES.GET.FALLBACK, (request,response)=>{
    response.redirect('/');
});

// WEBSOCKETS
io.on('connection', (socket)=>{

    // JOINING ROOM
    socket.on('join-room', async ()=>{
        socket.join(socket.room);
        
        // set client socket data
        socket.emit('set-data',{
            admin: socket.admin,
            room: socket.room,
            user: socket.user
        });

        // inform room of joined user
        io.to(socket.room).emit('user-joined', {
            user: socket.user,
            room: socket.room
        });
        
        // inform new user of any current members or messages
        const sockets = await io.in(socket.room).fetchSockets();
        if(sockets.length >= 2){

            const others = [];
            for(let i = 0; i < sockets.length; i++){
                const sock = sockets[i];
                if(sock.id !== socket.id){
                    others.push(sock.user);
                }
            }
            socket.emit('current-users', {
                users: others
            });

            const stored_messages = await getRoomDataForSocket(socket);

            if(stored_messages){
                socket.emit('current-messages',{
                    storedMessages: stored_messages
                });
            }
        }
    });   
   
    // CHAT MESSAGING
    socket.on('chat-message', async (data)=>{

        const checked_data = checkSocketChatMessageData(data);

        if(!checked_data){
            // eventually return message to user...
            console.log('Improper data send through socket.');
        }else{
            const chat_data = {
                admin: checked_data.admin,
                message: checked_data.message,
                time: checked_data.time,
                translate: false,
                translation: ``,
                username: checked_data.username,
            };
    
            await saveChatMessageData(socket, chat_data);
    
            io.to(socket.room).emit('chat-message', chat_data);
        }
    });

    socket.on('translate-message', async (data)=>{

        const checked_data = checkSocketTranslateMessageData(data);

        if(!checked_data){

        }else{
            const translation = await translateText(checked_data.message, checked_data.language);

            const translated_data = {
                admin: checked_data.admin,
                message: checked_data.message,
                time: checked_data.time,
                translate: true,
                translation: translation,
                username: checked_data.username,
            };

            await saveChatMessageData(socket, translated_data);

            io.to(socket.room).emit('chat-message', translated_data);
        }
    });
    socket.on('chat-image', async (data)=>{

        await saveChatImageData(socket,{
            admin: data.admin,
            imageData: data.imageData,
            time: data.time,
            username: data.username,
        })

        io.to(socket.room).emit('chat-image', {
            admin: data.admin,
            username: data.username,
            time: data.time,
            imageData: data.imageData
        },
        { binary: true });
    });

    // VIDEO CALL
    socket.on('request-call', async (data)=>{
        const sockets = await io.in(socket.room).fetchSockets();
        if(sockets.length <= 1){
            io.to(socket.id).emit('no-users', {
                title: `Room only contains you.`,
                message: `There is no one else in the room.`,
                instructions: `Just wait...`
            });
        }else{
            socket.to(socket.room).emit('requesting-call',{
                username: data.username
            })
        }
    });

    socket.on('accept-call', (data)=>{
        socket.to(socket.room).emit('call-accepted', {
            username: data.username
        })
    });

    socket.on('decline-call', (data)=>{
        socket.to(socket.room).emit('call-denied',{
            username: data.username
        })
    });

    socket.on('end-call', (data)=>{
        io.to(socket.room).emit('ending-call',{
            username: data.username
        })
    });

    // WEBRTC
    socket.on('offer', (data)=>{
        socket.to(socket.room).emit('handle-offer', {
            offer: data.offer
        });
    });

    socket.on('answer', (data)=>{
        socket.to(socket.room).emit('handle-answer', {
            answer: data.answer
        });
    });

    socket.on('candidate', (data)=>{
        socket.to(socket.room).emit('handle-candidate', {
            candidate: data.candidate
        })
    });

    socket.on('muted', (data)=>{
        io.to(socket.room).emit('track-muted',{
            type: data.type,
            muted: data.muted,
            user: data.user
        });
    });

    // ERRORS
    socket.on('error', (error)=>{
        socket.emit('server-error', {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please try again.`
        });
    });
    
    // DISCONNECT
    socket.on('disconnect', ()=>{
        userLeaveRoom(io,socket)
    });

});


server.listen(port, ()=> console.log(`Server running on port ${port}`));

export { io };