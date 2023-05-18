import * as Validate from "../validate.js";
import { displayClientNotificationMessage } from "../notifications/notification.js";

const LOGIN = {
    FORM: document.querySelector('.js-login_form'),
    INPUTS: {
        EMAIL: document.querySelector('.js-login-email'),
        PASSWORD: document.querySelector('.js-login-password')
    },
    NOTIFICATIONS: {
        MAIN:document.querySelector('.js-client-notification') 
    }
}

function initializeLoginPage(){
    LOGIN.INPUTS.PASSWORD.addEventListener('change', validateLoginPassword);
    LOGIN.INPUTS.EMAIL.addEventListener('change', validateLoginEmail);
    LOGIN.FORM.addEventListener('submit', handleLoginSubmit);
};

function validateLoginEmail({currentTarget}){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;
        if(!Validate.isEmail(value)){
            displayClientNotificationMessage(LOGIN.NOTIFICATIONS.MAIN,{
                title: 'Login Error',
                message: `That's not a valid email address.`,
                instructions: 'Please provide a valid EMAIL address. mail@host.com'
            });
        }
    }
};

function validateLoginPassword({currentTarget}){
    if(typeof currentTarget.value === 'string'){
        const value = currentTarget.value;
        if(!Validate.isPassword(value, { requireSpecialCharacter: true })){
            displayClientNotificationMessage(LOGIN.NOTIFICATIONS.MAIN, {
                title: 'Login Error',
                message: `That is not the valid password.`,
                instructions: 'Password must be min 8 characters and must include letters and at least 1 number and 1 punctuation.'
            });
        }
    }
};

async function handleLoginSubmit(event){
    event.preventDefault();
    
    const form_data = new URLSearchParams(new FormData(event.target));
    const login_url = event.target.action;
    try{
        const response = await postLoginFormData(form_data, login_url);
        if(response){
            if(response.ok){
                window.location.replace('/user/home');
            }else{
                const data = await response.json();
                if(!data.success){
                    displayClientNotificationMessage(LOGIN.NOTIFICATIONS.MAIN, data); 
                }
            }
        }else{
            displayClientNotificationMessage(LOGIN.NOTIFICATIONS.MAIN, {
                title: `Network error`,
                message: `No response received from server.`,
                instructions: `Please wait a few moments and try again.`
            });
        }
    }catch(error){
        //handle network error
        displayClientNotificationMessage(LOGIN.NOTIFICATIONS.MAIN, {
            title: `Network error`,
            message: `There is a problem with the network connection.`,
            instructions: `Please wait a few moments and try again.`
        });
    }

};
async function postLoginFormData(formData, loginUrl){
    const result = await fetch(loginUrl, {
        method: 'post',
        body: formData
    });
    return result;
};

document.addEventListener('DOMContentLoaded', initializeLoginPage);