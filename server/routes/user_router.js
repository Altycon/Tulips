import express from 'express';
import { ROUTES } from './routes.js';

import {
     getUserHome, 
     getUserRoom,
     //createRoom,
     //joinRoom,
     userLogout 
} from '../controllers/user_controller.js';
import { verifyUserSession } from '../middleware/verify_user_session_middleware.js';
//import { validateRoomForm } from '../middleware/validate_room_form_middleware.js';

const userRouter = express.Router();

userRouter.get(ROUTES.GET.HOME, verifyUserSession, getUserHome);
userRouter.get(ROUTES.GET.ROOM, verifyUserSession, getUserRoom);

//userRouter.post(ROUTES.POST.ROOM_CREATE, validateRoomForm, createRoom);
//userRouter.post(ROUTES.POST.ROOM_JOIN, validateRoomForm, joinRoom);

userRouter.post(ROUTES.POST.LOGOUT, userLogout);

export { userRouter };