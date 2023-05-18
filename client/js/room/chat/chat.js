import { ROOM, addRoomNotification } from "../room.js";
import { socket } from "../socket/socket.js";
import { isImage } from "./chat_utilities.js";

// LANGUAGE
function openLanguageSelection(){
    ROOM.CHAT.OPTIONS.LANGUAGES.classList.toggle('open');
    if(ROOM.CHAT.OPTIONS.LANGUAGES.classList.contains('open')){
        addLanguageListeners();
    }else{
        removeLanguageListeners();
    }
    if(ROOM.CHAT.OPTIONS.EMOTICONS.classList.contains('open')){
        ROOM.CHAT.OPTIONS.EMOTICONS.classList.remove('open');
    }
};
function addLanguageListeners(){
    ROOM.CHAT.LANGUAGES.forEach( button => {
        button.addEventListener('click', handleLanguageSelection)
    });
};
function removeLanguageListeners(){
    ROOM.CHAT.LANGUAGES.forEach( button => {
        button.removeEventListener('click', handleLanguageSelection)
    });
};
function removeActiveLanguage(){
    ROOM.CHAT.LANGUAGES.forEach( button => {
        if(button.classList.contains('active')){
            button.classList.remove('active');
        }
    });
}
function handleLanguageSelection({currentTarget}){
    if(!currentTarget || !currentTarget.value) return;
    
    removeActiveLanguage();
    
    currentTarget.classList.add('active');

    // DO SOMETHING WITH VALUE
    ROOM.LANGUAGE = currentTarget.value;
    addRoomNotification(`Translation language: ${currentTarget.title}`)

    // wait a moment to close menu
    setTimeout( ()=> {
        ROOM.CHAT.OPTIONS.LANGUAGES.classList.remove('open');
        removeLanguageListeners();
    },500);
};

function setActiveLanguage(language){
    removeActiveLanguage();

    const len = ROOM.CHAT.LANGUAGES.length;
    for(let i = 0; i < len; i++){
        const button = ROOM.CHAT.LANGUAGES[i];
        if(button.value === language){
            button.classList.add('active');
            return button;
        }
    }
    return false;
}



// EMOTICONS
function openEmoticonMenu(ev){
    ROOM.CHAT.OPTIONS.EMOTICONS.classList.toggle('open');
    if(ROOM.CHAT.OPTIONS.EMOTICONS.classList.contains('open')){
        addEmoticonListeners();
    }else{
        removeEmoticonListeners();
    }
    if(ROOM.CHAT.OPTIONS.LANGUAGES.classList.contains('open')){
        ROOM.CHAT.OPTIONS.LANGUAGES.classList.remove('open');
    }
};
function addEmoticonListeners(){
    ROOM.CHAT.EMOTICONS.forEach( button => {
        button.addEventListener('click', handleEmoticonSelection);
    });
};
function removeEmoticonListeners(){
    ROOM.CHAT.EMOTICONS.forEach( button => {
        button.removeEventListener('click', handleEmoticonSelection);
    });
};
function handleEmoticonSelection({currentTarget}){
    if(!currentTarget || !currentTarget.value) return;

    const value = currentTarget.innerText;

    ROOM.CHAT.MESSAGE_INPUT.value += value;

    setTimeout( ()=> {
        ROOM.CHAT.OPTIONS.EMOTICONS.classList.remove('open');
        removeEmoticonListeners();
    },500);
};


// ATTACHMENTS/IMAGES
function addAttachmentToMessage({currentTarget}){
    ROOM.CHAT.IMAGE_INPUT.click();
};

// SETTINGS
function openChatSettingMenu(ev){
    const { target } = ev;

    // Still need to figure out what I want to do
    // here.
};



function onKeyDown(ev){
    const { key, keyCode, shiftKey } = ev;
    if(key === 'Enter' || keyCode === 13){
        if(!ROOM.isMobile && !shiftKey){
            ev.preventDefault();
            sendMessageToServer();
        }
    }
}

function sendMessageToServer(){
    const message = ROOM.CHAT.MESSAGE_INPUT.value;
    if(!message || message === ''){
        addRoomNotification(`No messge to send`)
        return;
    }

    const TIME = new Date().getTime();

    if(ROOM.TRANSLATE){
        socket.emit('translate-message', {
            admin: socket.admin,
            message: message,
            time: TIME,
            language: ROOM.LANGUAGE,
            username: socket.user,
        });
    }else{
        socket.emit('chat-message', {
            admin: socket.admin,
            message: message,
            time: TIME,
            username: socket.user,
        });
    }
};


function handleImageUpload({ currentTarget }){

    if(!currentTarget.files || !currentTarget.files[0]){
        addRoomNotification('No file selected');
        return;
    }

    const file = currentTarget.files[0];

    if(file.size > 9999999){
        // if the file size is larger than 1mb,
        // socket.io will auto disconnect...
        alert('File must be smaller than 1mb');
        return;
    }
    if(!(isImage(file.name))){
        alert(`File must be image: png, jpg, bmp, gif`);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {

        const arrayBuffer = reader.result;

        const TIME = new Date().getTime();

        socket.emit('chat-image', {
            admin: socket.admin,
            username: socket.user,
            time: TIME,
            imageData: arrayBuffer
        });
    }
    reader.readAsDataURL(file);
};



function addChatButtonListeners(){
    ROOM.CHAT.MESSAGE_INPUT.addEventListener('keydown', onKeyDown);
    ROOM.CHAT.BUTTON.SEND.addEventListener('click', sendMessageToServer);
    ROOM.CHAT.BUTTON.LANGUAGE.addEventListener('click', openLanguageSelection);
    ROOM.CHAT.BUTTON.EMOJIS.addEventListener('click', openEmoticonMenu);
    ROOM.CHAT.BUTTON.ATTACHMENT.addEventListener('click', addAttachmentToMessage);
    ROOM.CHAT.IMAGE_INPUT.addEventListener('change', handleImageUpload)
    ROOM.CHAT.BUTTON.SETTINGS.addEventListener('click', openChatSettingMenu);
};
function removeChatButtonListeners(){
    ROOM.CHAT.MESSAGE_INPUT.removeEventListener('keydown', onKeyDown);
    ROOM.CHAT.BUTTON.SEND.removeEventListener('click', sendMessageToServer);
    ROOM.CHAT.BUTTON.LANGUAGE.removeEventListener('click', openLanguageSelection);
    ROOM.CHAT.BUTTON.EMOJIS.removeEventListener('click', openEmoticonMenu);
    ROOM.CHAT.BUTTON.ATTACHMENT.removeEventListener('click', addAttachmentToMessage);
    ROOM.CHAT.IMAGE_INPUT.removeEventListener('change', handleImageUpload)
    ROOM.CHAT.BUTTON.SETTINGS.removeEventListener('click', openChatSettingMenu);
};

export { 
    addChatButtonListeners, 
    removeChatButtonListeners,
    setActiveLanguage
};