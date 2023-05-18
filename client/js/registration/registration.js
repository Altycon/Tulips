import * as Validate from "../validate.js";
import { displayClientNotificationMessage } from "../notifications/notification.js";

const REGISTRATION = {
    FORM: document.querySelector('.js-signup_form'),
    INPUTS: {
        USERNAME: document.querySelector('.js-signup-username'),
        EMAIL: document.querySelector('.js-signup-email'),
        PASSWORD: document.querySelector('.js-signup-password')
    },
    NOTIFICATIONS: {
        MAIN:document.querySelector('.js-client-notification') 
    },
    CLIENT_ERROR_DISPLAY: document.querySelector('.js-signup-client-error'),
    SERVER_ERROR_DISPLAY: document.querySelector('.js-signup-server-error'),
};


function initializeRegistrationPage(){
    REGISTRATION.INPUTS.EMAIL.addEventListener('change', validateRegistrationEmail);
    REGISTRATION.INPUTS.PASSWORD.addEventListener('change', validateRegistrationPassword);
    REGISTRATION.FORM.addEventListener('submit', handleRegistrationSubmit);
};

function validateRegistrationEmail({currentTarget}){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;
        if(!Validate.isEmail(value)){
            displayClientNotificationMessage(REGISTRATION.NOTIFICATIONS.MAIN, {
                title: `Registration Error`,
                message: `That is not a valid email address.`,
                instructions: `Please provide a valid EMAIL address. mail@host.com`
            });
        }
    }
};

function validateRegistrationPassword({currentTarget}){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;
        if(!Validate.isPassword(value, { requireSpecialCharacter: true })){
            displayClientNotificationMessage(REGISTRATION.NOTIFICATIONS.MAIN,{
                title: `Registration Error`,
                message: `Your password is gonna have to be better than that.`,
                instructions: 'Your password should contain atleast 8 characters, 1 number, and 1 punctuation.'
            });
        }
    }
};


async function handleRegistrationSubmit(event){
    event.preventDefault();
    const form_data = new URLSearchParams(new FormData(event.target));
    const login_url = event.target.action;
    try{
        const response = await postRegistrationFormData(form_data, login_url);
        if(response){
            if(response.ok){
                window.location.replace('/auth/email_sent');
            }else{
                const data = await response.json();
                if(!data.success){
                    displayClientNotificationMessage(REGISTRATION.NOTIFICATIONS.MAIN, data); 
                }
            }
        }else{
            displayClientNotificationMessage(REGISTRATION.NOTIFICATIONS.MAIN, {
                title: `Network error`,
                message: `No response received from server.`,
                instructions: `Please wait a few moments and try again.`
            });
        }
    }catch(error){
        //handle network error
        displayClientNotificationMessage(REGISTRATION.NOTIFICATIONS.MAIN, {
            title: `Network error`,
            message: `There is a problem with the network connection.`,
            instructions: `Please wait a few moments and try again.`
        });
    }
};
async function postRegistrationFormData(formData, loginUrl){
    const result = await fetch(loginUrl, {
        method: 'post',
        body: formData
    });
    return result;
};

document.addEventListener('DOMContentLoaded', initializeRegistrationPage);