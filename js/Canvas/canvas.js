import { ROOM } from "../room.js";
import { DPI, fixCanvas, getCanvasPenParameters } from "./canvas-utilities.js";
import { Pointer } from "./pointer.js";

function initializeCanvas(){
    if(!ROOM.CANVAS.DISPLAY || ROOM.CANVAS.DISPLAY === null){
        console.alert('Canvas element does not exist in html');
        return;
    }

    // make sure canvas will work with any device
    // adjust by Dpi (devicePixelRatio)
    fixCanvas(ROOM.CANVAS.DISPLAY, DPI);
    ROOM.CANVAS.CONTEXT = ROOM.CANVAS.DISPLAY.getContext('2d');

    const { size, color } = getCanvasPenParameters();

    ROOM.CANVAS.POINTER = new Pointer(size*2,color)
    ROOM.CANVAS.POINTER.track(ROOM.CANVAS.DISPLAY);
    
    return 0;
}



export { initializeCanvas };