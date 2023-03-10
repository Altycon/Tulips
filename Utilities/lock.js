function lockBody(){
    document.body.style.overflow = 'hidden';
};
function unLockBody(){
    document.body.style.overflow = 'auto';
}

export { lockBody, unLockBody };