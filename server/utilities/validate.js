
function isUsername(username){
    const valid_regex = /^[a-zA-Z0-9]+$/;
    const max_characters = 15;

    if(username.length > max_characters){
        return false;
    }
    if(!valid_regex.test(username)){
        return false;
    }
    return true;
};
function isEmail(str){
    const parts = str.split('@');
    
    // make sure that string includes '@' by checking
    // if parts array contains two values
    if(parts.length !== 2){
        return false;
    }

    // Check if the local part is at least one character long and doesn't contain invalid characters
    if (parts[0].length < 1 || !/^[a-zA-Z0-9.\-_]+$/.test(parts[0])) {
        return false;
    }

    // Check if the domain part is at least two characters long and doesn't contain invalid characters
    if (parts[1].length < 2 || !/^[a-zA-Z0-9.]+$/.test(parts[1])) {
        return false;
    }

    // Check if the domain part contains at least one dot
    if (parts[1].indexOf('.') === -1) {
        return false;
    }

    return true;
}

function isPassword(password, options = {}){
    // set default options
    const min = options.min ?? 8;
    const requireDigit = options.requireDigit ?? true;
    const requireSpecialCharacter = options.requireSpecialCharacter ?? false;

    // check password length
    if(password.length < min){
        return false;
    }
    // check if password contains a digit
    if(requireDigit && !/\d/.test(password)){
        return false;
    }
    // check if password contains a special character
    if(requireSpecialCharacter && !/[!@#$%*(),.?":{}|<>]/.test(password)){
        return false;
    }
    return true;
}

function isSession(request){
    if(request.session === null || request.session === undefined){
        return false;
    }else if(request.session.id === null || request.session.id === undefined || request.session.id.includes(' ')){
        return false;
    }else if(!request.sessionStore){
        return false;
    }
    return true;
}

function isRoomName(roomName){
    const valid_characters_regex = /^[a-zA-Z0-9_-]+$/;
    const min_length = 5;
    const max_length = 20;

    if(roomName.length < min_length || roomName.length > max_length){
        return false;
    }
    if(!valid_characters_regex.test(roomName)){
        return false;
    }
    return true;
};

function isPasskey(passkey){
    if(!passkey) return false;
    if(passkey.length < 4) return false;
    if(isNaN(passkey)) return false;
    return true;
};

export { 
    isUsername,
    isEmail, 
    isPassword, 
    isSession, 
    isRoomName,
    isPasskey 
};