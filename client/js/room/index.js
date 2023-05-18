
import { socket, handleLeavingRoom } from "./socket/socket.js";
import { ROOM, addRoomNotification, addRoomListeners } from "./room.js";
import { isMobileDevice, setUserLanguage } from "../utilities/utilities.js";
import { addVideoButtonListeners } from "./video/video_controls.js";
import { setActiveLanguage } from "./chat/chat.js";
import { displayClientNotificationMessage } from "../notifications/notification.js";


function initializeRoom(){
    
    ROOM.isMobile = isMobileDevice(navigator.userAgent || navigator.vendor || window.opera);
    ROOM.LANGUAGE = setUserLanguage(navigator.language || navigator.userLanguage);
    setActiveLanguage(ROOM.LANGUAGE);
    addRoomNotification(`Device language: ${ROOM.LANGUAGE}`);

    ROOM.CONTROLS.LEAVE_ROOM.addEventListener('click', handleLeavingRoom);
    addRoomListeners();
    addVideoButtonListeners();

    socket.connect();



    window.addEventListener('error', (error)=>{
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN,{
            title: `The browser has encountered an error`,
            message: `${error}`,
            instructions: `No instructions at the moment...`
        });
    });
    if ('visualViewport' in window) {
        const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = 0.75;
        window.visualViewport.addEventListener('resize', function (event) {
            if ((event.target.height * event.target.scale) / window.screen.height <
                VIEWPORT_VS_CLIENT_HEIGHT_RATIO){
    
                document.body.scroll({
                    top: document.body.scrollHeight,
                        left: 0,
                        behavior: 'smooth'
                });
            }
        });
    };
};



initializeRoom();