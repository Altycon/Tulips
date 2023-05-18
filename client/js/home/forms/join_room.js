import { HOME } from "../home.js";
import { openWindow, closeWindow } from "../../utilities/utilities.js";
import { isRoomName, isPasskey } from "../../validate.js";
import { displayClientNotificationMessage } from "../../notifications/notification.js";

function validateJoinRoomName({ currentTarget }){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;

        if(!isRoomName(value)){
            displayClientNotificationMessage(
                HOME.NOTIFICATIONS.CLIENT.MAIN, {
                    title: `Invalid name`,
                    message: `Room names must be in a certain format.`,
                    instructions: `Name must only contain letters, numbers, and _-. Min: 5 characters. Max: 15 characters. Example: loab123, loab-123, loab_123, 1-l-2-o_3-a-4-d.`
                });
        }
    }
};

function validateJoinRoomPasskey({ currentTarget }){

    const value = currentTarget.value;

    if(!isPasskey(value)){
        displayClientNotificationMessage(
            HOME.NOTIFICATIONS.CLIENT.MAIN,{
                title: `Invalid Passkey`,
                message: `Your passkey just isn't that good.`,
                instructions: `Your SECRET passkey must be at least 4 digits long. 6 digits are recommended but if you can thing of a 10 digit number or higher, it's alomost impossible for someone to guess the same thing and would take a computer years to figure out.`
            });
    }
    
};


async function handleJoinRoomSubmit(event){
    event.preventDefault();
    const form_data = new URLSearchParams(new FormData(event.target));
    const login_url = event.target.action;

    try{
        const response = await postJoinRoomFormData(form_data, login_url);
        if(response){
            if(response.ok){
                window.location.replace('/user/room');
            }else{
                const data = await response.json();
                if(data && !data.success){
                    displayClientNotificationMessage(HOME.NOTIFICATIONS.CLIENT.MAIN, data);
                }
            }
        }else{
            displayClientNotificationMessage(HOME.NOTIFICATIONS.CLIENT.MAIN, {
                title: `Network error`,
                message: `No response received from server.`,
                instructions: `Please wait a few moments and try again.`
            });
        }
    }catch(error){
        displayClientNotificationMessage(HOME.NOTIFICATIONS.CLIENT.MAIN, {
            title: `Network error`,
            message: `No response received from server.`,
            instructions: `Please wait a few moments and try again.`
        });
    }
};
async function postJoinRoomFormData(formData, loginUrl){
    const result = fetch(loginUrl, {
        method: 'post',
        body: formData
    });
    return result;
};

function cancelJoinRoom({currentTarget}){
    closeWindow(HOME.POPUPS.JOIN_ROOM);

    HOME.ROOMS.INPUTS.JOIN.value = '';
    HOME.ROOMS.INPUTS.JOIN_PASSKEY.value = '';
    currentTarget.removeEventListener('click', cancelJoinRoom);
};

function openJoinRoomForm(){
    openWindow(HOME.POPUPS.JOIN_ROOM);

    HOME.ROOMS.FORMS.JOIN.addEventListener('submit', handleJoinRoomSubmit);
    HOME.ROOMS.INPUTS.JOIN.addEventListener('change', validateJoinRoomName);
    HOME.ROOMS.INPUTS.JOIN_PASSKEY.addEventListener('change', validateJoinRoomPasskey);

    HOME.POPUPS.CANCEL_JOIN_BUTTON.addEventListener('click', cancelJoinRoom);
};


export {
    openJoinRoomForm,
    cancelJoinRoom
}