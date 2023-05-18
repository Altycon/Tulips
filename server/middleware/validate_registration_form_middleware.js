
import { 
    isUsername, 
    isEmail, 
    isPassword 
} from "../utilities/validate.js";
import { VIEWS } from "../views/views.js";

function validateRegistrationForm(request,response,next){
    try{
        const data = request.body;

        data.username = data.username.trim();
        data.email = data.email.trim();
        data.password = data.password.trim();

        if(!data.username || !data.email || !data.password){
            return response.status(401).json({
                title: `Registration Error`,
                message: `All fields are required.`,
                instructions: `Please provide a email and password`,
                success: false
            });
        }else if(!isUsername(data.username)){
            return response.status(401).json({
                title: `Registration Error`,
                message: `Ivalid USERNAME. Please make sure you username contains letters,numbers,_,-, and must be between 8-30 characters.`,
                instructions: `Please create a username for your Tulips account.`,
                success: false
            });
        }else if(!isEmail(data.email)){
            return response.status(401).json({
                title: `Registration Error`,
                message: `Please provide a valid EMAIL address. Ex: email323@email.com.`,
                instructions: `Please provide a valid EMAIL address. mail@host.com.`,
                success: false
            });
        }else if(!isPassword(data.password, { requireSpecialCharacter: true })){
            return response.status(401).json({
                title: `Registration Error`,
                message: `Your password is gonna have to be better than that.`,
                instructions: `Password must be min 8 characters and must include letters and at least 1 number and 1 punctuation.`,
                success: false
            });
        }else{
            next();
        }
    }catch(error){
        response.render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { validateRegistrationForm };