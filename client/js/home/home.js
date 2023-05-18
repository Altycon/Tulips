
const HOME = {
    NAVIGATION: {
        MENU: document.querySelector('.HomePage_navigation'),
        USER_BUTTON: document.querySelector('.user-navigation_button')
    },
    ROOMS: {
        BUTTONS: {
            CREATE: document.querySelector('.js-create-room_btn'),
            JOIN: document.querySelector('.js-join-room_btn'),
            GENERATE_PASSKEY: document.querySelector('.js-generate-passkey_btn')
        },
        FORMS: {
            CREATE: document.querySelector('.js-create-room_form'),
            JOIN: document.querySelector('.js-join-room_form')
        },
        INPUTS: {
            CREATE: document.querySelector('.js-create-room_input'),
            CREATE_PASSKEY: document.querySelector('.js-create-room-passkey_input'),
            JOIN: document.querySelector('.js-join-room_input'),
            JOIN_PASSKEY: document.querySelector('.js-join-room-passkey_input')
        }
    },
    POPUPS: {
        CREATE_ROOM: document.querySelector('.js-create-room_popup'),
        CANCEL_CREATE_BUTTON: document.querySelector('.js-cancel-create_btn'),
        JOIN_ROOM: document.querySelector('.js-join-room_popup'),
        CANCEL_JOIN_BUTTON: document.querySelector('.js-cancel-join_btn')
    },
    NOTIFICATIONS: {
        CLIENT: {
            MAIN: document.querySelector('.js-client-notification'),
            CONTENT: document.querySelector('.js-client-notification_content'),
            TITLE: document.querySelector('.js-client-notification_title'),
            MESSAGE: document.querySelector('.js-client-notification_message'),
            INSTRUCTIONS: document.querySelector('.js-client-notification_instructions'),
            CLOSE_BUTTON: document.querySelector('.js-client-notification-close_btn')
        }
        

    }
};

export { HOME };