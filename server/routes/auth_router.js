import express from 'express';
import { ROUTES } from './routes.js';

import { validateRegistrationForm } from '../middleware/validate_registration_form_middleware.js';
import { validateLoginFormData } from '../middleware/validate_login_form_middleware.js';

import { 
    getEmailSentPage,
    registerUser, 
    verifyRegistrationEmail, 
    authenticateUser
} from '../controllers/auth_controller.js';

const authRouter = express.Router();

authRouter.get(ROUTES.GET.EMAIL_SENT, getEmailSentPage)
authRouter.get(ROUTES.GET.VERIFY_REGISTRATION_EMAIL, verifyRegistrationEmail);

authRouter.post(ROUTES.POST.REGISTER, validateRegistrationForm, registerUser);
authRouter.post(ROUTES.POST.LOGIN, validateLoginFormData, authenticateUser);

export { authRouter };