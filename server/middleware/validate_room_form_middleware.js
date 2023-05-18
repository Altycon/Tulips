import { isRoomName, isPasskey } from "../utilities/validate.js";
import { VIEWS } from "../views/views.js";

function validateRoomForm(request,response,next){
    try{
        const data = request.body;

        data.room = data.room.trim();
        data.passkey = data.passkey.trim();
        
        if(!data.room || !data.passkey){
            return response.status(401).json({
                title: `All fields required!`,
                message: `You must have a name and passkey for your room`,
                instructions: `Please enter both a name and passkey to continue.`
            })
        }else if(!isRoomName(data.room)){
            return response.status(401).json({
                title: `Invalid Room name`,
                message: `That's not how these room names work...for now.`,
                instructions: `Name must only contain letters, numbers, and _-. Min: 5 characters. Max: 15 characters. Example: loab123, loab-123, loab_123, 1-l-2-o_3-a-4-d.`
            });
        }else if(!isPasskey(data.passkey)){
            return response.status(401).json({
                title: `Invalid Passkey`,
                message: `Your passkey just isn't that good.`,
                instructions: `Your SECRET passkey must be at least 4 digits long. 6 digits are recommended but if you can thing of a 10 digit number or higher, it's alomost impossible for someone to guess the same thing and would take a computer years to figure out.`
            });
        }else{
            next();
        }
    }catch(error){
        response.render(VIEWS.ERROR, { success: false, message: error.message });
    }
};

export { validateRoomForm };
