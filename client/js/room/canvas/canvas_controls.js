import { ROOM } from "../room.js";
import { clearCanvas } from "./canvas_utilities.js";
import { unLockBody } from "../utilities/lock.js";

// PEN CONTROLS
function openPenSizeOptions(ev){
    ROOM.CANVAS.PEN_SIZE_OPTIONS.classList.toggle('open');
    if(ROOM.CANVAS.PEN_SIZE_OPTIONS.classList.contains('open')){
        addPenSizOptionListeners();
    }else{
        removePenSizeOptionListeners();
    }
};
function addPenSizOptionListeners(){
    ROOM.CANVAS.PEN_SIZES.forEach( size => {
        size.addEventListener('click', handlePenSizeSelected);
    });
};
function removePenSizeOptionListeners(){
    ROOM.CANVAS.PEN_SIZES.forEach( size => {
        size.removeEventListener('click', handlePenSizeSelected);
    });
}
function handlePenSizeSelected({currentTarget}){
    ROOM.CANVAS.PEN_SIZES.forEach( size => {
        size.classList.remove('selected');
    });
    currentTarget.classList.add('selected');

    if(ROOM.CANVAS.POINTER){
        ROOM.CANVAS.POINTER.setSize(+currentTarget.value*2);
    }
    setTimeout( ()=>{
        ROOM.CANVAS.PEN_SIZE_OPTIONS.classList.remove('open');
        removePenSizeOptionListeners();
    },500)
};


// ERASE CANVAS
function handleErasingCanvas(){
    clearCanvas(ROOM.CANVAS.CONTEXT);
}


// PEN COLOR CONTROLS
function openPenColorPicker({currentTarget}){ 
    ROOM.CANVAS.PEN_COLOR_INPUT.addEventListener('input', handleColorPickerInput);
    ROOM.CANVAS.PEN_COLOR_INPUT.click();
};
function handleColorPickerInput({currentTarget}){
    if(ROOM.CANVAS.POINTER){
        ROOM.CANVAS.POINTER.setColor(currentTarget.value);
    }
    ROOM.CANVAS.BUTTON.COLOR.style.setProperty('--selection-color', currentTarget.value);
    currentTarget.removeEventListener('input', handleColorPickerInput);
};




function activateCanvas({currentTarget}){
    if(currentTarget.dataset.active){
        currentTarget.addEventListener('transitionend', slideCanvasControlsDown);
        currentTarget.dataset.active = 'false';
    }else{
        currentTarget.dataset.active = 'true';
    }
};

function closeCanvasContainer({currentTarget}){
    ROOM.CANVAS.CONTAINER.classList.remove('open');
    ROOM.CANVAS.CONTROLS.style.animation = '';
    currentTarget.removeEventListener('animationend', closeCanvasContainer);
    ROOM.CONTROLS.MAIN_BUTTONS.forEach( main_btn => {
        main_btn.classList.remove('hide');
    });
    unLockBody();
};
function slideCanvasControlsDown({currentTarget}){
    ROOM.CANVAS.CONTROLS.addEventListener('animationend', closeCanvasContainer);
    ROOM.CANVAS.CONTROLS.style.animation = 'slideDown 500ms linear forwards';
    currentTarget.removeEventListener('transitionend', slideCanvasControlsDown);
};

function addCanvasListeners(){
    ROOM.CANVAS.BUTTON.PEN_SIZE.addEventListener('click', openPenSizeOptions);
    ROOM.CANVAS.BUTTON.COLOR.addEventListener('click', openPenColorPicker);
    ROOM.CANVAS.BUTTON.ERASE_CANVAS.addEventListener('click', handleErasingCanvas)
    ROOM.CANVAS.BUTTON.ACTIVATION.addEventListener('click', activateCanvas);
};
function removeCanvasListeners(){
    ROOM.CANVAS.BUTTON.PEN_SIZE.removeEventListener('click', openPenSizeOptions);
    ROOM.CANVAS.BUTTON.COLOR.removeEventListener('click', openPenColorPicker);
    ROOM.CANVAS.BUTTON.ACTIVATION.removeEventListener('click', activateCanvas);
}
export { addCanvasListeners, removeCanvasListeners };