import * as dotenv from 'dotenv';
import mongoose from "mongoose";
import { logError } from '../logger/log-error.js';
dotenv.config();

mongoose.set('strictQuery', false);

const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

async function connectDatabase(){
    try{
        await mongoose.connect(process.env.MONGODB_URI, MONGOOSE_OPTIONS);
    }catch(error){
        logError(error);
    }
};

export { connectDatabase };