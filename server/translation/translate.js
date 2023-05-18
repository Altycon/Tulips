import { Translation } from "../config/translation.js";

async function translateText(text,targetLanguage){
    try{
        const [ response ] = await Translation.translate(text, targetLanguage);
        return response;
    }catch(error){
        return false;
    }
}

export { translateText };