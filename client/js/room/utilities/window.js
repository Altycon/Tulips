function openWindow(container){
    container.classList.add('open');
    return container;
};
function closeWindow(container){
    container.classList.add('close');
    container.firstElementChild.addEventListener('animationend', removeOpen);
    function removeOpen({target}){
        container.classList.remove('close');
        container.classList.remove('open');
        target.removeEventListener('animationend', removeOpen);
    }
};

export { openWindow, closeWindow};