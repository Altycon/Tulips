import * as dotenv from 'dotenv';
import NodeMailer from 'nodemailer';
import { TransporterEmailError } from '../../utilities/errors.js';
import { logError } from '../../logger/log-error.js';
dotenv.config();

const Transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

Transporter.verify( (error)=>{
    if(error){
        const ERROR = new TransporterEmailError(error.message);
        logError(ERROR);
        return;
    }
});

export { Transporter };