import { ROOM } from "../room.js";
import { isImage } from "../../Utilities/validate-image-file.js";
import { addMessageToChatWindow, addImageToChatWindow } from "./chat-utilities.js"; // <= for testing


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
function handleLanguageSelection({currentTarget}){
    if(!currentTarget || !currentTarget.value) return;
    

    ROOM.CHAT.LANGUAGES.forEach( button => {
        button.classList.remove('active');
    });
    currentTarget.classList.add('active');

    // DO SOMETHING WITH VALUE
    const value = currentTarget.value;
    console.log(value);


    // wait a moment to close menu
    setTimeout( ()=> {
        ROOM.CHAT.OPTIONS.LANGUAGES.classList.remove('open');
        removeLanguageListeners();
    },500);
};



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

    // DO SOMETHING WITH VALUE
    const value = currentTarget.innerText;
    console.log('Emoticon: ', value);

    ROOM.CHAT.MESSAGE_INPUT.value += value;

    // wait a moment to close menu
    setTimeout( ()=> {
        ROOM.CHAT.OPTIONS.EMOTICONS.classList.remove('open');
        removeEmoticonListeners();
    },500);
}


// ATTACHMENTS/IMAGES
function addAttachmentToMessage({currentTarget}){
    checkForOpenedChatOptionMenus();

    console.log('Add attachment to message here', currentTarget);

    ROOM.CHAT.IMAGE_INPUT.click();
};




// SETTINGS
function openChatSettingMenu(ev){
    const { target } = ev;
    console.log('Open chat setting menu here', target);
};



function onKeyDown(ev){
    const { key, keyCode, shiftKey } = ev;
    if(key === 'Enter' || keyCode === 13){
        if(!ROOM.isMobile && !shiftKey){
            ev.preventDefault();
            //sendMessageToServer();
            TESTaddMessageToChat(); // <= for testing
        }
    }
}
function TESTaddMessageToChat(){ // <= for testing 
    const message = ROOM.CHAT.MESSAGE_INPUT.value;
    if(!message || message === ''){
        console.log('No message to send')
        return;
    }
    const NOW = new Date();
    const TIME = `${NOW.toLocaleTimeString()} ${NOW.toLocaleDateString()}`;
    addMessageToChatWindow({ 
        type: 'client', 
        username: 'CLIENT', 
        message: message, 
        room: 'Room101',
        time: TIME
    });
};
// function sendMessageToServer(){
//     const message = CHAT.MESSAGE_INPUT.value;
//     if(!message || message === ''){
//         console.log('No message to send')
//         return;
//     }
//     const NOW = Date();
//     sendToServer({ 
//         type: 'message', 
//         user: username, 
//         message: message, 
//         room: room,
//         time: NOW
//     });
// };


function handleImageUpload(ev){
    const { currentTarget } = ev;
    console.log(ev)
    if(!currentTarget.files || !currentTarget.files[0]) return;

    const file = currentTarget.files[0];
    if(file.size > 10000000){
        alert('File must be smaller than 1mb');
        return;
    }
    if(!(isImage(file.name))){
        alert(`File must be image: png, jpg, bmp, gif`);
        return;
    }
    const NOW = new Date();
    const TIME = `${NOW.toLocaleTimeString()} ${NOW.toLocaleDateString()}`
    addImageToChatWindow({ // <= for testing
        type: 'client',
        username: 'CLIENT',
        time: TIME,
        data: file
    });
    // sendToServer({
    //     type: 'attachment',
    //     user: username,
    //     message: message,
    //     room: room,
    //     time: NOW
    // })

};



function addChatButtonListeners(){
    ROOM.CHAT.MESSAGE_INPUT.addEventListener('keydown', onKeyDown);
    //ROOM.CHAT.BUTTON.SEND.addEventListener('click', sendMessageToServer);
    ROOM.CHAT.BUTTON.SEND.addEventListener('click', TESTaddMessageToChat); // <= for testing 
    ROOM.CHAT.BUTTON.LANGUAGE.addEventListener('click', openLanguageSelection);
    ROOM.CHAT.BUTTON.EMOJIS.addEventListener('click', openEmoticonMenu);
    ROOM.CHAT.BUTTON.ATTACHMENT.addEventListener('click', addAttachmentToMessage);
    ROOM.CHAT.IMAGE_INPUT.addEventListener('change', handleImageUpload)
    ROOM.CHAT.BUTTON.SETTINGS.addEventListener('click', openChatSettingMenu);
};
function removeChatButtonListeners(){
    ROOM.CHAT.MESSAGE_INPUT.removeEventListener('keydown', onKeyDown);
    //ROOM.CHAT.BUTTON.SEND.removeEventListener('click', sendMessageToServer);
    ROOM.CHAT.BUTTON.SEND.removeEventListener('click', TESTaddMessageToChat); // <= for testing 
    ROOM.CHAT.BUTTON.LANGUAGE.removeEventListener('click', openLanguageSelection);
    ROOM.CHAT.BUTTON.EMOJIS.removeEventListener('click', openEmoticonMenu);
    ROOM.CHAT.BUTTON.ATTACHMENT.removeEventListener('click', addAttachmentToMessage);
    ROOM.CHAT.IMAGE_INPUT.removeEventListener('change', handleImageUpload)
    ROOM.CHAT.BUTTON.SETTINGS.removeEventListener('click', openChatSettingMenu);
};

export { addChatButtonListeners, removeChatButtonListeners };