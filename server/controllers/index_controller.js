import { VIEWS } from "../views/views.js";

function getIndexPage(request,response){
    response.status(200).render(VIEWS.INDEX);
};

function getRegisterPage(request,response){
    response.status(200).render(VIEWS.REGISTER);
};

function getLoginPage(request,response){
    response.status(200).render(VIEWS.LOGIN);
};

function getErrorPage(request,response){
    response.status(500).render(VIEWS.ERROR, { 
        success: true, 
        message: false 
    });
};

export { 
    getIndexPage, 
    getRegisterPage, 
    getLoginPage, 
    getErrorPage 
};