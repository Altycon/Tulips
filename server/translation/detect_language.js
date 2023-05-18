import { Translation } from "../config/translation.js";

async function detectLanguage(text){
    try{
        const response = await Translation.detect(text);
        return response[0].language;
    }catch(error){
        return false;
    }
};

export { detectLanguage };