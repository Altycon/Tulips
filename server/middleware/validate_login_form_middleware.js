import { isEmail, isPassword } from "../utilities/validate.js";
import { VIEWS } from "../views/views.js";

function validateLoginFormData(request, response, next) {
    try {
        const data = request.body;

        data.email = data.email.trim();
        data.password = data.password.trim();

        if(!data.email || !data.password) {
            return response.status(401).json({
                title: 'Login Error',
                message: 'All fields are required',
                instructions: 'Please provide a email and password',
                success: false
            })
        }else if(!isEmail(data.email)) {
            return response.status(401).json({
                title: 'Login Error',
                message: `That's not a valid email address.`,
                instructions: 'Please provide a valid EMAIL address. mail@host.com',
                success: false
            });
        }else if(!isPassword(data.password,{ requireSpecialCharacter: true })) {
            return response.status(401).json({
                title: 'Login Error',
                message: `Your password is gonna have to be better than that.`,
                instructions: 'Password must be min 8 characters and must include letters and at least 1 number and 1 punctuation.',
                success: false
            })
        }else if(data.rememberMe && data.rememberMe !== 'checked'){
            return response.status(401).json({
                title: 'Login Error',
                message: `Some how the 'remember me' checkbox has an invalid value.`,
                instructions: `There is nothing you can do but refresh. This is a developer issue. Sorry about that.`,
                success: false
            })
        }else{
            next();
        }
    } catch (error) {
        response.render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { validateLoginFormData };