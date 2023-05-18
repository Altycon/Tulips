import { openWindow, closeWindow } from "./utilities/window.js";
import { lockBody, unLockBody } from "./utilities/lock.js";
import { addChatButtonListeners, removeChatButtonListeners } from "./chat/chat.js";
import { addCanvasListeners, removeCanvasListeners } from "./canvas/canvas_controls.js";
import { initializeCanvas } from "./canvas/canvas.js";

const ROOM = {
    isMobile: false,
    NAME: null,
    USER: null,
    LANGUAGE: null,
    TRANSLATE: false,
    AUDIO: {
        MUTED: false
    },
    CONTROLS: {
        MUTE_VIDEO: document.querySelector('.js-mute-video_btn'),
        MUTE_AUDIO: document.querySelector('.js-mute-audio_btn'),
        END_CALL: document.querySelector('.js-end-call_btn'),
        START_CALL: document.querySelector('.js-start-call_btn'),
        MAIN_BUTTONS: [...document.querySelectorAll('.js-main_btn')],
        MORE: document.querySelector('.js-open-more_btn'),
        CANVAS: document.querySelector('.js-chat-canvas_btn'),
        TRANSLATION: document.querySelector('.js-chat-translate_btn'),
        CHAT: document.querySelector('.js-chat-display_btn'),
        OPTION_BUTTONS: [...document.querySelectorAll('.js-app-option_btn')],
        LEAVE_ROOM: document.querySelector('.js-leave-room_btn')
    },
    VIDEO: {
        CLIENT: document.getElementById('Video2'),
        PEER: document.getElementById('Video1'),
        MUTED: false
    },
    CHAT: {
        WINDOW: document.querySelector('.js-chat_window'),
        MESSAGE_INPUT: document.querySelector('.js-text-message_input'),
        BUTTON: {
            SEND: document.querySelector('.js-send-message_btn'),
            LANGUAGE: document.querySelector('.js-translate-language_btn'),
            EMOJIS: document.querySelector('.js-message-emojis_btn'),
            ATTACHMENT: document.querySelector('.js-message-attachment_btn'),
            SETTINGS: document.querySelector('.js-chat-settings_btn')
        },
        CONTAINER: {
            MAIN: document.querySelector('.js-chat_container'),
            CONTROLS: document.querySelector('.js-chat_controls')
        },
        OPTIONS: {
            LANGUAGES: document.querySelector('.js-chat-languages'),
            EMOTICONS: document.querySelector('.js-chat-emoticons')
        },
        LANGUAGES: [...document.querySelectorAll('.js-chat-language')],
        EMOTICONS: [...document.querySelectorAll('.js-chat-emoticon')],
        IMAGE_INPUT: document.querySelector('.js-image-upload_input'),
        autoScrollToBottom: ()=>{
            ROOM.CHAT.WINDOW.scroll({
                top: ROOM.CHAT.WINDOW.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }
    },
    CANVAS: {
        CONTAINER: document.querySelector('.js-canvas_container'),
        DISPLAY: document.querySelector('.js-canvas'),
        CONTEXT: null,
        POINTER: null,
        CONTROLS: document.querySelector('.js-canvas_controls'),
        BUTTON:{
            PEN_SIZE: document.querySelector('.js-pen-size_btn'),
            COLOR: document.querySelector('.js-pen-color_btn'),
            ERASE_CANVAS: document.querySelector('.js-erase-canvas_btn'),
            ACTIVATION: document.querySelector('.js-canvas-activation_btn')
        },
        PEN_SIZE_OPTIONS: document.querySelector('.js-pen-size_options'),
        PEN_SIZES: [...document.querySelectorAll('.js-pen-size_option')],
        PEN_COLOR_INPUT: document.querySelector('.js-pen-color_input'),
        ERASER_SIZE_OPTIONS: document.querySelector('.js-eraser-size_options'),
        ERASER_SIZES: [...document.querySelectorAll('.js-eraser-size_option')]
    },
    CONNECTION: {
        PEER: null,
        STREAM: {
            LOCAL: null,
            REMOTE: null
        },
        MEDIA_CONSTRANTS: {
            video:{
                width:{min:640, ideal: 1920, max:1920},
                height:{min:480, ideal: 1080, max:1080}
            },
            audio: false
        },
        SERVERS: {
            iceServers: [
                {
                    urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
                }
            ]
        }
    },
    NOTIFICATION:{
        MAIN: document.querySelector('.js-client-notification'),
        SECONDARY: document.querySelector('.js-video-notification'),
        ROOM: document.querySelector('.js-room-notification'),
        ROOM_LIST: document.querySelector('.js-room-notification_list')
    }
};

function addRoomNotification(notification){
    const li = document.createElement('li');
    li.setAttribute('class', `room-notification_message`);
    li.innerText = notification;
    ROOM.NOTIFICATION.ROOM_LIST.appendChild(li);
    ROOM.NOTIFICATION.ROOM_LIST.scroll({
        top: ROOM.NOTIFICATION.ROOM_LIST.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
};

function openMoreAppOptions(ev){
    const { target } = ev;
    ROOM.CONTROLS.OPTION_BUTTONS.forEach( option_btn => {
        option_btn.classList.toggle('open');
    })
};


function openCanvasDisplay(){
    
    ROOM.CANVAS.BUTTON.ACTIVATION.dataset.active = 'true';
    ROOM.CONTROLS.MAIN_BUTTONS.forEach( main_btn => {
        main_btn.classList.add('hide');
    });
    ROOM.CONTROLS.OPTION_BUTTONS.forEach( option_btn => {
        option_btn.classList.remove('open');
    });

    if(!(ROOM.CANVAS.CONTAINER.classList.contains('open'))){
        if(ROOM.CHAT.CONTAINER.MAIN.classList.contains('open')){
            closeWindow(ROOM.CHAT.CONTAINER.MAIN);
            closeWindow(ROOM.CHAT.CONTAINER.CONTROLS);
            removeChatButtonListeners();
        }
        openWindow(ROOM.CANVAS.CONTAINER);
        initializeCanvas();
        addCanvasListeners();
        lockBody();
    }else{
        closeWindow(ROOM.CANVAS.CONTAINER);
        removeCanvasListeners();
        ROOM.CONTROLS.MAIN_BUTTONS.forEach( main_btn => {
            main_btn.classList.add('hide');
        });
        unLockBody();
    };
};



function activateTranslation({currentTarget}){
    
    if(!ROOM.CHAT.BUTTON.LANGUAGE.classList.contains('active')){
        ROOM.CHAT.BUTTON.LANGUAGE.classList.add('active');
        currentTarget.classList.add('selected');
        ROOM.TRANSLATE = true;
        addRoomNotification(`Translation: "on"`);
    }else{
        ROOM.CHAT.BUTTON.LANGUAGE.classList.remove('active');
        currentTarget.classList.remove('selected');
        ROOM.TRANSLATE = false;
        addRoomNotification('Translation: "off"');
    }
};

function openChatWindow(){
    openWindow(ROOM.CHAT.CONTAINER.MAIN);
    openWindow(ROOM.CHAT.CONTAINER.CONTROLS);
    addChatButtonListeners();
};

function closeChatWindow(){
    closeWindow(ROOM.CHAT.CONTAINER.MAIN);
    closeWindow(ROOM.CHAT.CONTAINER.CONTROLS);
    removeChatButtonListeners();
}

function handleOpenChat(){
    // add active class to currentTarget(button) to show that it is on
    if(!(ROOM.CHAT.CONTAINER.MAIN.classList.contains('open')) ||
    !(ROOM.CHAT.CONTAINER.CONTROLS.classList.contains('open'))){
       openChatWindow();
    }else{
        closeChatWindow();
    }
};


function addRoomListeners(){
    ROOM.CONTROLS.MORE.addEventListener('click', openMoreAppOptions);
    ROOM.CONTROLS.CANVAS.addEventListener('click', openCanvasDisplay);
    ROOM.CONTROLS.TRANSLATION.addEventListener('click', activateTranslation);
    ROOM.CONTROLS.CHAT.addEventListener('click', handleOpenChat);
}

export { 
    ROOM,
    addRoomNotification,
    openChatWindow, 
    addRoomListeners 
};