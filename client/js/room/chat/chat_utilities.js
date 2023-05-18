import { ROOM, addRoomNotification } from "../room.js";

function addMessageToChatWindow(type, data){
    const { 
        message,
        time,
        translate, 
        translation, 
        username 
    } = data;

    const time_object = new Date(time);

    const df = new DocumentFragment();

    const div = document.createElement('div');
    div.setAttribute('class', `${type}-chat`);
    const p1 = document.createElement('p');
    p1.setAttribute('class', `${type}-chat_name`);
    const p2 = document.createElement('p');
    p2.setAttribute('class', `${type}-chat_time`);
    const p3 = document.createElement('p');
    p3.setAttribute('class', `${type}-chat_message`);
    
    
    p1.innerText = username;
    p2.innerText = `${time_object.toLocaleTimeString()} ${time_object.toLocaleDateString()}`;
    p3.innerText = message;
    

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    if(translate){
        const p4 = document.createElement('p');
        p4.setAttribute('class', `${type}-chat_message-translation`);
        p4.innerText = translation;
        div.appendChild(p4);
    }
    
    df.appendChild(div);

    ROOM.CHAT.WINDOW.append(df);
    ROOM.CHAT.autoScrollToBottom();
    ROOM.CHAT.MESSAGE_INPUT.value = '';
};

function addNotificationToChatWindow(notification){
    const p = document.createElement('p');
    p.setAttribute('class', `chat-notification`);
    p.innerText = notification;
    ROOM.CHAT.WINDOW.appendChild(p);
};

function addImageToChatWindow(data){
    const { type, username, time, imageData } = data;

    const time_object = new Date(time);
    
    const df = new DocumentFragment();

    const div = document.createElement('div');
    div.setAttribute('class', `${type}-chat`);
    
    const p1 = document.createElement('p');
    p1.setAttribute('class', `${type}-chat_name`);
    p1.innerText = username;

    const p2 = document.createElement('p');
    p2.setAttribute('class', `${type}-chat_time`);
    p2.innerText = `${time_object.toLocaleTimeString()} ${time_object.toLocaleDateString()}`;

    const img = document.createElement('img');
    img.setAttribute('class', `${type}-chat_img`);
    img.onload = (ev)=>{
        ROOM.CHAT.autoScrollToBottom();
    }
    img.onerror = (err)=>{
       addRoomNotification('There was an error loading the image');
    }
    img.src = imageData;
    
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(img);

    df.appendChild(div);

    ROOM.CHAT.WINDOW.append(df);
    ROOM.CHAT.autoScrollToBottom();
};

function getExtension(filename){
    const parts = filename.split('.');
    return parts[parts.length - 1];
};

function isImage(filename){
    const extension = getExtension(filename);
    switch(extension.toLowerCase()){
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            return true;
        default:
            return false;
    }
};


export { 
    addNotificationToChatWindow, 
    addMessageToChatWindow, 
    addImageToChatWindow,
    isImage 
};