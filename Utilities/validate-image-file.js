
function getExtension(filename){
    const parts = filename.split('.');
    return parts[parts.length - 1];
};

function isImage(filename){
    const extension = getExtension(filename);
    switch(extension.toLowerCase()){
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            return true;
        default:
            return false;
    }
}

export { isImage };