class RegistrationError extends Error{
    constructor(message){
        super(message);
        this.name = 'RegistrationError'
    }
};
class LoginError extends Error{
    constructor(message){
        super(message);
        this.name = 'LoginError'
    }
};
export { RegistrationError, LoginError };