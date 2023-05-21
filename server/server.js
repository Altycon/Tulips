import { connectDatabase } from './config/database.js';
import express from 'express';
import * as env from 'dotenv';
import helmet from 'helmet'; 
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import { createServer } from 'http';
//import { Server } from 'socket.io';
import path from 'path';
import { userSessionOptions } from './config/session.js';

import { ROUTES } from './routes/routes.js';
import { indexRouter } from './routes/index_router.js';
import { authRouter } from './routes/auth_router.js';
import { userRouter } from './routes/user_router.js';
import { errorApplicationMiddleware } from './middleware/error_application_middleware.js';

connectDatabase();
env.config();

const port = process.env.PORT || 3000;
const origin = process.env.NODE_ENV === 'production' ? process.env.HOST_URL:`http://localhost:3000`

const App = express();
const server = createServer(App);

App.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views'));
App.set('view engine', 'ejs');

App.use(express.static('client'));
App.use('/favicon.ico', express.static('img/icons/favicon.ico'));

// request and response header security
App.use(compression());
App.use(helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
}));
App.use(cors({
    origin: origin,
    credentials: true
}));

// handling user form requests for request.body
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

App.set('trust proxy', 1);
App.use(session(userSessionOptions))

App.use(ROUTES.GET.INDEX, indexRouter);
App.use(ROUTES.GET.AUTH, authRouter);
App.use(ROUTES.GET.USER, userRouter);

App.use(errorApplicationMiddleware);

App.get(ROUTES.GET.FALLBACK, (request,response)=>{
    response.redirect('/');
});

server.listen(port, ()=> console.log(`Server running on port ${port}`));

//export { io };