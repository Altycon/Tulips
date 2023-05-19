import bcrypt from 'bcrypt';
import { ROUTES } from "../routes/routes.js";
import { VIEWS } from "../views/views.js";
import { hashData } from "../utilities/hash-data.js";
import { User } from "../models/user_model.js";
import { sendVerificationEmail } from "../communications/email/send_verification_email.js";
import { UserVerification } from "../models/user_verification_model.js";
import { verifyHashData } from '../utilities/verify_hash_data.js';

async function getEmailSentPage(request,response){
    response.render(VIEWS.EMAIL_SENT)
}

async function createUser(userData){
    try{
        const { username, email, password } = userData;

        const hashed_password = await hashData(password);
        const new_user = new User({
            username,
            email,
            password: hashed_password,
            active: false,
            verified: false,
        });
        return await new_user.save();
    }catch(error){
        throw error;
    }
};
async function verifyRegistrationEmail(request,response){
    try{

        const { userId, uniqueString } = request.params;

        const verification_records = await UserVerification.find({ userId });

        if(!verification_records){
            response.render(VIEWS.VERIFIED, {
                success: false, 
                message: `An Error occured attempting to verify your email. Please try again.`
            });
        }else{
            const { expiresAt } = verification_records[0];
            const hashed_unique_string = verification_records[0].uniqueString;

            if(expiresAt < Date.now()){
                
                await UserVerification.deleteOne({ userId });
                await User.deleteOne({ _id: userId });
                response.render(VIEWS.VERIFIED, {
                    success: false, 
                    message: `Verification Email has expired. Please register with Tulips again.`
                });
            }else{

                const is_unique_string_valid = bcrypt.compare(uniqueString, hashed_unique_string);

                if(!is_unique_string_valid){
                    response.render(VIEWS.VERIFIED, {
                        success: false, 
                        message: `Invalid verification information. Please try link from your email again or try signing up again.`
                    });
                }else{

                    await User.updateOne({ _id: userId}, { verified: true });
                    await UserVerification.deleteOne({ userId });
            
                    response.render(VIEWS.VERIFIED, { 
                        success: true, 
                        message: `You have seccessfully registered with 'Tulips'!. Return to the site and login.` 
                    });
                }
            }
        }
    }catch(error){
        response.render(VIEWS.VERIFIED, { success: false, message: error.message });
    }
};
async function registerUser(request,response){
    try{
    
        const USER = await createUser(request.body);

        await sendVerificationEmail(USER);
        
        // create email-sent.ejs page with LOGIN button
        // render this page on success and failure/error
        //response.redirect(ROUTES.GET.LOGIN);

        return response.status(200).redirect(ROUTES.GET.EMAIL_SENT);
       
    }catch(error){
        response.render(VIEWS.ERROR, { success: false, message: error.message});
    }
};
async function getSessionData(request){
    const session_id = request.session.id;
    const session_store = request.sessionStore;

    return new Promise((resolve, reject) => {
        session_store.get(session_id, (error, sessionData) => {
            if (error) {
                reject(error);
            } else {
                resolve(sessionData);
            }
        });
    });
};
async function saveSessionData(request,sessionData){
    const session_id = request.session.id;
    const session_store = request.sessionStore;

    return new Promise((resolve, reject) => {
        session_store.set(session_id, sessionData, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};
async function authenticateUser(request,response){
    try{
        const data = request.body;
        const { email, password, rememberMe } = data;

        const fetched_user = await User.find({ email });

        if(!fetched_user || fetched_user.length === 0){
            return response.status(401).json({
                title: `Email`,
                message: `The email you entered does not exist`,
                instructions: `Please provide an existing email address.`,
                success: false
            });
        }else if(!fetched_user[0].verified){
            return response.status(401).json({
                title: `Unverified email.`,
                message: `Your email is not verified.`,
                instructions: `Please check your email. If you have made a mistake entering your email address, you made need to register with Tulips again.`,
                success: false
            });
        }else{

            const stored_password = fetched_user[0].password;
            const is_password_valid = await verifyHashData( password, stored_password );

            if(!is_password_valid){
                return response.status(401).json({
                    title: `Password`,
                    message: `Incorrect password`,
                    instructions: `Please try again...`,
                    success: false
                })
            }else{
                const USER_ID = fetched_user[0]._id;
                const session = request.session;

                if(rememberMe){
                    session.cookie.maxAge = 604800000 // 7*24*60*60*1000 - 1 week
                }

                session.authenticated = true;
                session.user = { userId: USER_ID, username: fetched_user[0].username };

                await saveSessionData(request,session);
                
                await User.updateOne({ _id: USER_ID }, { active: true });

                return response.status(200).redirect(ROUTES.GET.USER_HOME);
            }
        }   
    }catch(error){
        response.status(500).render(VIEWS.ERROR, { success: false, message: error.message });
    };
};

export { 
    getEmailSentPage,
    registerUser, 
    verifyRegistrationEmail, 
    authenticateUser,
};