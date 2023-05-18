
function checkSocketChatMessageData(data){

    if(typeof data.admin !== 'boolean') return null;
    if(typeof data.message !== 'string') return null;
    if(typeof data.time !== 'number') return null;
    if(typeof data.username !== 'string') return null;

    data.message = data.message.trim();
    data.username = data.username.trim();
    return data;
};

function checkSocketTranslateMessageData(data){

    if(typeof data.admin !== 'boolean') return null;
    if(typeof data.message !== 'string') return null;
    if(typeof data.time !== 'number') return null;
    if(typeof data.language !== 'string') return null;
    if(typeof data.username !== 'string') return null;

    data.message = data.message.trim();
    data.language = data.language.trim();
    data.username = data.username.trim();
    return data;
};


export { 
    checkSocketChatMessageData,
    checkSocketTranslateMessageData
};