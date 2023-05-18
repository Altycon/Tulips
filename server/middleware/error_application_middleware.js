
function errorApplicationMiddleware(error, request, response, next){

    response.status(404);

    if(request.accepts('html')){
        // user can accept html
        response.render('pages/error', { success: false, message: error.message});
        return;
    }else if(request.accepts('json')){
        // user can accept json
        response.json({error: `I have no idea what happend if you see this but we both know something went wront...`});
        return;
    }else{
        // User doesn't accept anthing else but text
        if(error.message){
            response.send(error.message);
        }else{
            response.send(`Something is definetly wrong if you're getting this...`);
        }
        return;   
    }
};

export { errorApplicationMiddleware };