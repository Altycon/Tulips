import { ROOM } from "../room.js";



function addMessageToChatWindow(data){
    const { 
        type, 
        username, 
        message, 
        translation, 
        time 
    } = data;

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
    p2.innerText = time;
    p3.innerText = message;
    

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    if(translation){
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

function addImageToChatWindow(image_data){
    const { type, username, time, data } = image_data;
    
    const df = new DocumentFragment();

    const div = document.createElement('div');
    div.setAttribute('class', `${type}-chat`);
    const p1 = document.createElement('p');
    p1.setAttribute('class', `${type}-chat_name`);
    p1.innerText = username;

    const p2 = document.createElement('p');
    p2.setAttribute('class', `${type}-chat_time`);
    p2.innerText = time;

    const img = document.createElement('img');
    img.setAttribute('class', `${type}-chat_img`);
    img.onload = (ev)=>{
        ROOM.CHAT.autoScrollToBottom();
    }
    img.onerror = (err)=>{
        console.log(err)
    }
    img.src = URL.createObjectURL(data);
    

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(img);

    df.appendChild(div);

    ROOM.CHAT.WINDOW.append(df);
    ROOM.CHAT.autoScrollToBottom();
}

export { addNotificationToChatWindow, addMessageToChatWindow, addImageToChatWindow };