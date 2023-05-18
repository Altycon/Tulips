import * as dotenv from 'dotenv';
import ejs from 'ejs';
import { v4 as uuidv4 } from 'uuid';

import { UserVerification } from '../../models/user_verification_model.js';
import { hashData } from '../../utilities/hash-data.js';
import { Transporter } from './transporter.js';

dotenv.config();

async function createUserVerification(userId, uniqueString){
    try{

        const hashed_unique_string = await hashData(uniqueString);
        const new_verification = new UserVerification({
            userId: userId,
            uniqueString: hashed_unique_string,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });

        await new_verification.save();
      
    }catch(error){
        throw error;
    }
}

async function sendVerificationEmail({ _id, email }){
    try{
        const unique_string = uuidv4() + _id;

        const link = `${process.env.HOST_URL + "auth/verify/" + _id + "/" + unique_string}`;
        const html = await ejs.renderFile('./server/views/email/verification_email.ejs',{ link });

        const mail_options = {
            from: `${process.env.HOST_NAME} ${process.env.AUTH_EMAIL}`,
            to: email,
            subject: `Verify your ${process.env.HOST_NAME} email`,
            html: html
        };

        await Transporter.sendMail(mail_options);
        
        await createUserVerification(_id, unique_string);
        return true;
    }catch(error){
        throw error;
    }
};

export { sendVerificationEmail };