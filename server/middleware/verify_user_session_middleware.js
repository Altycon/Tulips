import { ROUTES } from "../routes/routes.js";
import { isSession } from '../utilities/validate.js';

function verifyUserSession(request,response,next){
    try{
        if(isSession(request)){

            const session_id = request.session.id;
            const session_store = request.sessionStore;

            session_store.get(session_id, (error, sessionData)=>{
                if(error){
                    console.log( error);
                    throw new Error(error.message);
                }else{
                    console.log('SessionData: ', sessionData);
                    
                    if(!sessionData || !sessionData.authenticated){
                        response.redirect(ROUTES.GET.LOGIN)
                    }else{
                        next();
                    }
                }
            }); 
        }else{
            console.log('No user session exists');
            next();
        }
    }catch(error){
        response.status(500).render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { verifyUserSession };