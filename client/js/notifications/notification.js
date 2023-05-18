
function displayClientNotificationMessage(element, data){

    const content = element.querySelector('.js-client-notification_content');
    const content_title = content.querySelector('.js-client-notification_title');
    const content_message = content.querySelector('.js-client-notification_message');
    const content_instructions = content.querySelector('.js-client-notification_instructions');
    const close_button = element.querySelector('.js-client-notification-close_btn');

    content_title.innerText = data.title || 'ERROR';
    content_message.innerText = '' + data.message || 'An error has occurred';
    content_instructions.innerText = data.instructions || 'Try again?...';

    element.classList.add('open');

    function handleCloseNotifications({ currentTarget }){

        element.classList.add('close');

        function removeClasses({ currentTarget }){
    
            content_title.innerText = '';
            content_message.innerText = '';
            content_instructions.innerText = '';
    
            element.classList.remove('open');
            element.classList.remove('close');

            currentTarget.removeEventListener('animationend', removeClasses);
        }
        content.addEventListener('animationend', removeClasses)
    
        currentTarget.removeEventListener('click', handleCloseNotifications);
    };

    close_button.addEventListener('click', handleCloseNotifications)
};

function displayVideoNotification(element, data, accept, decline){
    const content = element.querySelector('.js-video-notification_content');
    const content_title = content.querySelector('.js-video-notification_title');
    const content_message = content.querySelector('.js-video-notification_message');
    const decline_button = element.querySelector('.js-video-notification-decline_btn');
    const accept_button = element.querySelector('.js-video-notification-accept_btn');

    content_title.innerText = data.title;
    content_message.innerText = data.message;

    function removeClasses({ currentTarget }){
    
        content_title.innerText = '';
        content_message.innerText = '';

        element.classList.remove('open');
        element.classList.remove('close');

        currentTarget.removeEventListener('animationend', removeClasses);
    }

    function handleDecline({ currentTarget }){

        content.addEventListener('animationend', removeClasses);

        if(decline && typeof decline === 'function'){
            decline();
        }

        currentTarget.removeEventListener('click', handleDecline);

        element.classList.add('close');
    }

    function handleAccept({ currentTarget }){

        content.addEventListener('animationend', removeClasses);

        if(accept && typeof accept === 'function'){
            accept();
        }

        currentTarget.removeEventListener('click', handleAccept);
        element.classList.add('close');
    }

    decline_button.addEventListener('click', handleDecline);
    accept_button.addEventListener('click', handleAccept);

    element.classList.add('open');
}

export { 
    displayClientNotificationMessage,
    displayVideoNotification 
};
