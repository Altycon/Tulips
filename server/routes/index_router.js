import express from 'express';
import { ROUTES } from './routes.js';
import { 
    getIndexPage, 
    getRegisterPage, 
    getLoginPage,
    getErrorPage 
} from '../controllers/index_controller.js';
import { userSessionRedirect } from '../middleware/user_session_redirect_middleware.js';

const indexRouter = express.Router();

indexRouter.get(ROUTES.GET.INDEX, userSessionRedirect, getIndexPage);
indexRouter.get(ROUTES.GET.REGISTER, getRegisterPage);
indexRouter.get(ROUTES.GET.LOGIN, getLoginPage);
indexRouter.get(ROUTES.GET.ERROR, getErrorPage);


export { indexRouter };