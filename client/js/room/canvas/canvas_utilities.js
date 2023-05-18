import { ROOM } from "../room.js";

const DPI = devicePixelRatio;
const TWO_PI = Math.PI*2;

function fixCanvas(canvas,dpi){
    if(!canvas) return;
    const style_width = +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
    const style_height = +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
    canvas.setAttribute('width', style_width*dpi);
    canvas.setAttribute('height', style_height*dpi);
    return 0;
};
function clearCanvas(context){
    const { width, height } = context.canvas;
    context.clearRect(0,0,width,height);
};
// function addVectorToCanvas(vector,size,color){
//     DRAWING.context.beginPath();
//     DRAWING.context.fillStyle = color;
//     DRAWING.context.arc(vector.x, vector.y, size, 0, TWO_PI);
//     DRAWING.context.fill();
// };

function getCanvasPenParameters(){
    const pen_size_selection = ROOM.CANVAS.PEN_SIZES.find( size => size.classList.contains('selected'));
    const pen_color = ROOM.CANVAS.PEN_COLOR_INPUT.value;
    return { 
        size: +pen_size_selection.value,
        color: pen_color
    };
};

export {
    DPI,
    TWO_PI,
    fixCanvas,
    clearCanvas,
    getCanvasPenParameters
};