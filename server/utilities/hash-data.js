import bcrypt from 'bcrypt';
import { HashingError } from './errors.js';

function hashData(data, salt_rounds = 10){
    try{
        const hashed_data = bcrypt.hash(data, salt_rounds);
        return hashed_data;
    }catch(error){
        throw new HashingError(error.message);
    }
};

export { hashData };