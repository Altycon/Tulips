import { HOME } from "./home.js";
import { openCreateRoomForm } from "./forms/create_room.js";
import { openJoinRoomForm } from "./forms/join_room.js";
import { displayClientNotificationMessage } from "../notifications/notification.js";

function openUserMenu(){
    HOME.NAVIGATION.MENU.classList.toggle('open');
};

function initializeHomePage(){
    HOME.NAVIGATION.USER_BUTTON.addEventListener('click', openUserMenu);
    HOME.ROOMS.BUTTONS.CREATE.addEventListener('click', openCreateRoomForm);
    HOME.ROOMS.BUTTONS.JOIN.addEventListener('click', openJoinRoomForm);
};

window.addEventListener('error', (error)=>{
    displayClientNotificationMessage(HOME.NOTIFICATIONS.CLIENT.MAIN,{
        title: `The browser has encountered an error`,
        message: `${error}`,
        instructions: `No instructions at the moment...`
    });
});

initializeHomePage();