import bcrypt from 'bcrypt';
import { HashingError } from './errors.js';

async function verifyHashData(unhashed_string, hashed_string){
    try{
        return await bcrypt.compare(unhashed_string, hashed_string);
    }catch(error){
        throw new HashingError('Error occured when hashing strings.');
    }
};

export { verifyHashData };