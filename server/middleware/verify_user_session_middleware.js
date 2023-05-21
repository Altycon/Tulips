import { ROUTES } from "../routes/routes.js";
import { isSession } from '../utilities/validate.js';

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

async function verifyUserSession(request,response,next){
    try{
        if(isSession(request)){

            // const session_id = request.session.id;
            // const session_store = request.sessionStore;

            // session_store.get(session_id, (error, sessionData)=>{
            //     if(error){
            //         console.log( error);
            //         response.redirect(ROUTES.GET.LOGIN)
            //     }else{
            //         console.log('SessionData: ', sessionData);
            //         next();
            //         // if(!sessionData || !sessionData.authenticated){
                        
            //         // }else{
                        
            //         // }
            //     }
            // }); 


            const data = await getSessionData(request);

            console.log('session-data (verify): ', data);
            
            if(data){
                next();
            }else{
                response.redirect(ROUTES.GET.LOGIN);
            }

        }else{
            console.log('No user session exists');
            next();
        }
    }catch(error){
        response.status(500).render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { verifyUserSession };