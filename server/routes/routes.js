
const ROUTES = {
    GET: {
        AUTH: '/auth',
        INDEX: '/',
        CONTACT: '/contact',
        ABOUT: '/about',
        USER: '/user',
        USER_HOME: '/user/home',
        LOGIN: '/login',
        REGISTER: '/register',
        HOME: '/home',
        ROOM: '/room',
        ERROR: '/error',
        FALLBACK: '*',
        VERIFY_REGISTRATION_EMAIL: '/verify/:userId/:uniqueString',
        EMAIL_SENT: '/email_sent'
    },
    POST: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        REGISTER: '/register',
        ROOM_CREATE: '/room/create',
        ROOM_JOIN: '/room/join'
    }
}

export { ROUTES };