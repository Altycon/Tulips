const ERROR_MESSAGES = {
    LOGIN: {
        ALL: 'All fields are required',
        EMAIL: 'Please provide a valid EMAIL address.',
        PASSWORD: 'PASSWORD must be at least 8 characters long and must contain at least 1 number and 1 punctuation.',
        REMEMBER_ME: `Invalid value from 'Rembember Me' checkbox`
    },
    REGISTRATION: {
        ALL: 'All fields are required.',
        USERNAME: 'Ivalid USERNAME. Please make sure you username is at contains letters,numbers,_,-, and must be bwtween 8-30 characters.',
        EMAIL: 'Please provide a valid EMAIL address. Ex: email323@email.com',
        PASSWORD: 'PASSWORD must be at least 8 characters long and must contain at least 1 number and 1 punctuation.'
    }
};

export { ERROR_MESSAGES };