import { isSession } from "../utilities/validate.js";
import { ROUTES } from "../routes/routes.js";
import { VIEWS } from "../views/views.js";

function userSessionRedirect(request,response,next){
    try{
        if(isSession(request)){

            const session_id = request.session.id;
            const session_store = request.sessionStore;

            session_store.get(session_id, (error, sessionData)=>{
                if(error){
                    throw error;
                }else{
                    if(!sessionData || !sessionData.authenticated){
                        next();
                    }else{
                        response.redirect(ROUTES.GET.USER_HOME);
                    }
                }
            }); 
        }else{
            next();
        }
    }catch(error){
        response.status(500).render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { userSessionRedirect };