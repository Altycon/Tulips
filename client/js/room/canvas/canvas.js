import { ROOM } from "../room.js";
import { DPI, fixCanvas, getCanvasPenParameters } from "./canvas_utilities.js";
import { Pointer } from "./canvas_pointer.js";

function initializeCanvas(){
    if(!ROOM.CANVAS.DISPLAY || ROOM.CANVAS.DISPLAY === null) return;

    fixCanvas(ROOM.CANVAS.DISPLAY, DPI);
    ROOM.CANVAS.CONTEXT = ROOM.CANVAS.DISPLAY.getContext('2d');

    const { size, color } = getCanvasPenParameters();

    ROOM.CANVAS.POINTER = new Pointer(size*2,color)
    ROOM.CANVAS.POINTER.track(ROOM.CANVAS.DISPLAY);
    
    return 0;
};

export { initializeCanvas };