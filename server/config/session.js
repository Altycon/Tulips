import * as env from 'dotenv';
import MongoStore from 'connect-mongo';

env.config();

const userSessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'user-sessions',
    ttl: 20000
});

const userSessionOptions = {
    authenticated: false,
    cookie: { 
        //domain: '',
        //expires: setExpirationDate((24 * 60 * 60 * 1000)), // add 1 day
        httpOnly: true, 
        maxAge: null, // 604800000, // 7*24*60*60*1000 - 1 week
        path: '/',
        sameSite: 'none', // true or 'strict' = strict, false = not set, 'lax' = (recommended)lax sameSite enforcement, 'none' = default-explicit cross-site cookie
        secure: false  // this will enforce 'https' secure connection
        //                  doesn't work with 'localhost' unless configured properly (OpenSSL certificates)
    },
    //genid: function(),
    name: 'user-session', // change this to 'tulips-session' or 'user-session'? //default = 'connect.sid'
    //proxy: undefined, // true "X-Forwarded-Proto" header will be used, false All headers ignored and connection considered secure if direct TLS/SSl ocnnection
    resave: false,
    rolling: false, // true = regenerates session id on every request(high security)
    saveUninitialized: false,
    secret: process.env.MONGO_SESSION_SECRET,
    store: userSessionStore,
    unset: 'destroy',
};

if(process.env.NODE_ENV === 'production'){
    userSessionOptions.cookie.sameSite = 'lax';
    userSessionOptions.cookie.secure = true;
}

export { userSessionOptions };