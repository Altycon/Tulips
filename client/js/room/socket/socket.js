import { 
    ROOM, 
    addRoomNotification, 
    openChatWindow 
} from "../room.js";
import { 
    addMessageToChatWindow, 
    addImageToChatWindow 
} from "../chat/chat_utilities.js";
import { 
    displayClientNotificationMessage, 
    displayVideoNotification 
} from "../../notifications/notification.js";
import { 
    createOffer, 
    createAnswer,
    addAnswer,
    addCandidate 
} from "../webrtc/webrtc.js";
import { activateSwitchVideoButtons } from "../video/video_controls.js";

// Connect to the server
//const socket = io("ws://localhost:3000");
const socket = io("https://tulips.herokuapp.com");

// CONNECTION
socket.on('connect', ()=>{
    socket.emit('join-room');
});

socket.on('set-data', (data)=>{
    socket.admin = data.admin;
    socket.room = data.room;
    socket.user = data.user;

    ROOM.NAME = data.room;
    ROOM.USER = data.user;
});

socket.on('user-joined', (data)=>{
    const message = `"${data.user}" has joined the room.`
    addRoomNotification(message);
});

socket.on('current-users', (data)=>{
    data.users.forEach( user => {
        addRoomNotification
        (`"${user}" has joined the room.`)
    })
});

socket.on('current-messages', (data)=>{
    const { storedMessages } = data;

    storedMessages.forEach( stored_message => {

        const isSender = stored_message.admin === socket.admin;
        let type = 'client';
        if(!isSender){
            type = 'peer';
        }
        if(stored_message.imageData){
            addImageToChatWindow({
                type,
                username: stored_message.username,
                time: stored_message.time,
                imageData: stored_message.imageData
            });
        }else{
            addMessageToChatWindow(type,{
                message: stored_message.message,
                time: stored_message.time,
                translate: stored_message.translate,
                translation: stored_message.translation,
                username: stored_message.username
            });
        }
    });
    
    if(!(ROOM.CHAT.CONTAINER.MAIN.classList.contains('open')) ||
    !(ROOM.CHAT.CONTAINER.CONTROLS.classList.contains('open'))){
       openChatWindow();
    }
});

// CHAT MESSAGING
socket.on('chat-message', (data) => {

    const { 
        admin,
        message, 
        time, 
        translate, 
        translation, 
        username, 
    } = data;

    const isSender = admin === socket.admin;
    let type = 'client';
    if(!isSender){
        type = 'peer';
    }

    addMessageToChatWindow(type,{
        message: message,
        time: time,
        translate: translate,
        translation: translation,
        username: username
    });

    if(!(ROOM.CHAT.CONTAINER.MAIN.classList.contains('open')) ||
    !(ROOM.CHAT.CONTAINER.CONTROLS.classList.contains('open'))){
       openChatWindow();
    }
});

// CHAT IMAGE
socket.on('chat-image', (data)=>{
    const { 
        admin, 
        username, 
        time, 
        imageData 
    } = data;

    const isSender = admin === socket.admin;
    let type = 'client';
    if(!isSender){
        type = 'peer';
    }
    
    addImageToChatWindow({
        type,
        username,
        time,
        imageData
    });

    if(!(ROOM.CHAT.CONTAINER.MAIN.classList.contains('open')) ||
    !(ROOM.CHAT.CONTAINER.CONTROLS.classList.contains('open'))){
       openChatWindow();
    }
});

// VIDEO CALL

socket.on('no-users', (data)=>{
    displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
        title: data.title,
        message: data.message,
        instructions: data.instructions
    })
});

socket.on('requesting-call', (data)=>{
    displayVideoNotification(ROOM.NOTIFICATION.SECONDARY, {
        title: 'Video call requested...',
        message: `Accept video call from: "${data.username}"?`
    },
    function accept(){
        socket.emit('accept-call', {
          username: socket.user
        });
    },
    function decline(){
        socket.emit('decline-call',{
          username: socket.user
        });
    })
});

socket.on('call-denied', (data)=>{
    displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN,{
        title: 'CALL DENIED...',
        message: `"${data.username}" has denied video call`,
        instructions: 'What a sad day ;-('
    })
});

// WEBRTC
socket.on('call-accepted', (data)=>{
    createOffer();
});
socket.on('handle-offer', (data)=>{
    createAnswer(data.offer);
});
socket.on('handle-answer', (data)=>{
    addAnswer(data.answer);
});
socket.on('handle-candidate', (data)=>{
    addCandidate(data.candidate);
});

socket.on('track-muted', (data)=>{
    const message = `${data.user} has ${data.muted ? 'muted':'unmuted'} ${data.type}`;
    addRoomNotification(message);
})
socket.on('ending-call', (data)=>{

    if(ROOM.CONNECTION.STREAM.REMOTE !== null){
        ROOM.CONNECTION.STREAM.REMOTE.getTracks().forEach( track => {
            if(track.readyState == 'live'){
                track.stop();
            }
        });
        ROOM.CONNECTION.STREAM.LOCAL.getTracks().forEach( track => {
            if(track.readyState == 'live'){
                track.stop();
            }
        });
        ROOM.VIDEO.PEER.src = null;
        ROOM.VIDEO.CLIENT.src = null;
    }else{
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `No connection`,
            message: `Audio and video are not connected to stop.`,
            instructions: `Just leave room or try connecting video and audio.`
        });
    }
    addRoomNotification(`"${data.username}" ended call`);
    activateSwitchVideoButtons();
});


// ERRORS
socket.on('error', (error)=>{
    displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN,{
        title: `Communication error...`,
        message: `${error.message}`,
        instructions: `Please try again?...`
    });
});

socket.on('server-error', (data)=>{
    displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
        title: data.title,
        message: data.message,
        instructions: data.instructions
    })
});

// DISCONNECT
socket.on('disconnect', (reason) => {
    if(reason === 'io server disconnect'){
      socket.connect();
    }
    window.location.replace('/user/home');
});

function handleLeavingRoom(){
    socket.disconnect();
};

export { socket, handleLeavingRoom };