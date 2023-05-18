import express from 'express';
import * as env from 'dotenv';
import path from 'path';

import { ROUTES } from './routes/routes.js';
import { indexRouter } from './routes/index_router.js';
//import { authRouter } from './routes/auth_router.js';
//import { userRouter } from './routes/user_router.js';

env.config();

const port = process.env.PORT || 3000;

const App = express();

App.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views'));
App.set('view engine', 'ejs');

App.use(express.static('client'));
App.use('/favicon.ico', express.static('img/icons/favicon.ico'));

App.use(ROUTES.GET.INDEX, indexRouter);
//App.use(ROUTES.GET.AUTH, authRouter);
//App.use(ROUTES.GET.USER, userRouter);

App.listen(port, ()=> console.log(`Tulips server listening on port ${port}`));