
class RegistrationFormError extends Error{
    constructor(message){
        super(message);
        this.name = 'RegistrationFormError';
    }
};
class LoginFormError extends Error{
    constructor(message){
        super(message);
        this.name = 'LoginFormError';
    }
};
class RoomFormError extends Error{
    constructor(message){
        super(message);
        this.name = 'RoomFormError'
    }
}

class HashingError extends Error{
    constructor(message){
        super(message);
        this.name = 'HashingError';
    }
};

class TransporterEmailError extends Error{
    constructor(message){
        super(message);
        this.name = 'TransporterEmailError';
    }
};
class ValidationError extends Error{
    constructor(message){
        super(message);
        this.name = 'ValidationError';
    }
};

class VerificationError extends Error{
    constructor(message){
        super(message);
        this.name = 'VerificationError';
    }
};
class AuthenticationError extends Error{
    constructor(message){
        super(message);
        this.name = 'AuthenticationError';
    }
};



export { 
    RegistrationFormError, 
    LoginFormError,
    RoomFormError,
    HashingError,
    TransporterEmailError,
    ValidationError,
    VerificationError,
    AuthenticationError
 };