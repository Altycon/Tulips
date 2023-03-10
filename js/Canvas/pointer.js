import { DPI, TWO_PI } from "./canvas-utilities.js";

let pointerInterval;

// This works but I'm not sure how to use it for multiple things
// I need to rethink all of this and what I want to do with it

class Pointer{
    constructor(size,color){
        this.x = null;
        this.y = null;
        this.dpi = DPI;
        this.touching = 0;
        this.size = size * this.dpi || 5 * this.dpi;
        this.color = color || 'black';
    }
    setState(n){
        this.touching = n;
    }
    setSize(size){
        this.size = size * this.dpi;
    }
    setColor(color){
        this.color = color;
    }
    clearPath(){
        this.path = [];
    }
    update(x,y){
        this.x = x * this.dpi;
        this.y = y * this.dpi;
    }
    reset(){
        this.x = null;
        this.y = null;
        this.setState(0);
        this.path = [];
    }
    render(context,color){
        context.fillStyle = color || 'black';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, TWO_PI);
        context.fill();
    }
    track(canvas){
        trackPointer(canvas,this)
    }
}

function trackPointer(canvas,pointer){
    canvas.focus();
    const dc_demensions = canvas.getBoundingClientRect();
    const dc_x = dc_demensions.x;
    const dc_y = dc_demensions.y;
    const dctx = canvas.getContext('2d');
    const pointerMove = (ev)=>{
        ev.preventDefault();
        const {pointerId, target, clientX, clientY} = ev;
        const x = clientX - dc_x;
        const y = clientY - dc_y;
        pointer.update(x, y);
        pointer.render(dctx, pointer.color);

        // sendToServer({
        //     type: 'drawing',
        //     vector: { x: x, y: y},
        //     size: pointer.size,
        //     color: pointer.color
        // })   
    }
    const pointerUp = (ev)=>{
        const { pointerId, target } = ev
        target.releasePointerCapture(pointerId);
        pointer.update(null,null);
        pointer.reset();
        target.removeEventListener('pointermove', pointerMove);
        target.removeEventListener('pointerup', pointerUp);
        
    }
    const pointerDown = (ev)=>{
        ev.preventDefault();
        const { pointerId, target, clientX, clientY } = ev; 
        target.setPointerCapture(pointerId);
        pointer.setState(1);
        const x = clientX - dc_x;
        const y = clientY - dc_y;
        pointer.update(x, y);
        pointer.render(dctx, pointer.color);

        // sendToServer({
        //     type: 'drawing',
        //     vector: { x: x, y: y},
        //     size: pointer.size,
        //     color: pointer.color
        // })
        target.addEventListener('pointermove', pointerMove);
        target.addEventListener('pointerup', pointerUp);
    }
    // stop context menu from poping up when holding mouse down
    canvas.addEventListener('contextmenu', (ev)=> {
        ev.preventDefault();
    })
    canvas.addEventListener('pointerdown', pointerDown);
};

export { Pointer }