import fs from 'fs';

function logError(error){

    // save error to file
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${error.name}: ${error.stack}`;
    fs.appendFile('error.log', log, (error)=>{
        if(error) console.error(`Error saving log: ${error}`);
    });
};

export { logError };