import { HOME } from "../home.js";
import { openWindow, closeWindow, generatePassKey } from "../../utilities/utilities.js";
import { displayClientNotificationMessage } from "../../notifications/notification.js";
import { isRoomName, isPasskey } from "../../validate.js";

function valideCreateRoomName({ currentTarget }){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;

        if(!isRoomName(value)){
            displayClientNotificationMessage(
                HOME.NOTIFICATIONS.CLIENT.MAIN,{
                    title: `Invalid Room name`,
                    message: `That's not how these room names work...for now.`,
                    instructions: `Name must only contain letters, numbers, and _-. Min: 5 characters. Max: 15 characters. Example: loab123, loab-123, loab_123, 1-l-2-o_3-a-4-d.`
                });
        }
    }
};

function validateCreateRoomPasskey({ currentTarget }){
    if(typeof currentTarget.value === 'number'){
        const value = currentTarget.value;

        if(!isPasskey(value)){
            displayClientNotificationMessage(
                HOME.NOTIFICATIONS.CLIENT.MAIN,{
                    title: `Invalid Passkey`,
                    message: `Your passkey just isn't that good.`,
                    instructions: `Your SECRET passkey must be at least 4 digits long. 6 digits are recommended but if you can thing of a 10 digit number or higher, it's alomost impossible for someone to guess the same thing and would take a computer years to figure out.`
                });
        }
    }
};

async function handleCreateRoomSubmit(event){
    event.preventDefault();
   
    const form_data = new URLSearchParams(new FormData(event.target));
    const login_url = event.target.action;

    try{
        const response = await postCreateRoomFormData(form_data, login_url);
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
        //handle network error
        displayClientNotificationMessage(HOME.NOTIFICATIONS.CLIENT.MAIN, {
            title: `Network error`,
            message: `There is a problem with the network connection.`,
            instructions: `Please wait a few moments and try again.`
        });
    }
};
async function postCreateRoomFormData(formData, loginUrl){
    const result = fetch(loginUrl, {
        method: 'post',
        body: formData
    });
    return result;
};

function generateUserPasskey({ currentTarget }){
    const key = generatePassKey();
    HOME.ROOMS.INPUTS.CREATE_PASSKEY.value = key;
}

function cancelCreateRoom({currentTarget}){
    closeWindow(HOME.POPUPS.CREATE_ROOM);
   
    HOME.ROOMS.INPUTS.CREATE.value = '';
    HOME.ROOMS.INPUTS.CREATE_PASSKEY.value = '';
    currentTarget.removeEventListener('click', cancelCreateRoom);
};

function openCreateRoomForm(){    
    openWindow(HOME.POPUPS.CREATE_ROOM);

    
    HOME.ROOMS.FORMS.CREATE.addEventListener('submit', handleCreateRoomSubmit);
    HOME.ROOMS.INPUTS.CREATE.addEventListener('change', valideCreateRoomName);
    HOME.ROOMS.INPUTS.CREATE_PASSKEY.addEventListener('change', validateCreateRoomPasskey);

    HOME.ROOMS.BUTTONS.GENERATE_PASSKEY.addEventListener('click', generateUserPasskey);
    HOME.POPUPS.CANCEL_CREATE_BUTTON.addEventListener('click', cancelCreateRoom);
};

export {
    openCreateRoomForm,
    cancelCreateRoom
}