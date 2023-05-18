import { DPI, TWO_PI } from "./canvas_utilities.js";

const hasPointerEvent = !!window.PointerEvent;

const pointerEventNames = {
  start: window.PointerEvent ? 'pointerdown' : 'touchstart',
  move: window.PointerEvent ? 'pointermove' : 'touchmove',
  end: window.PointerEvent ? 'pointerup' : 'touchend',
};

class Pointer{
    constructor(size,color){
        this.x = null;
        this.y = null;
        this.dpi = DPI;
        this.state = 0;
        this.size = size * this.dpi || 5 * this.dpi;
        this.color = color || 'black';
    }
    setState(n){
        this.state = n;
    }
    setSize(size){
        this.size = size * this.dpi;
    }
    setColor(color){
        this.color = color;
    }
    update(x,y){
        this.x = x * this.dpi;
        this.y = y * this.dpi;
    }
    reset(){
        this.x = null;
        this.y = null;
        this.setState(0);
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
        let x, y;
        if(ev.touches && ev.touches[0]){
            for(let i = 0; i < ev.touches.length; i++){
                x = ev.touches[i].clientX - dc_x;
                y = ev.touches[i].clientY - dc_y;
                pointer.update(x, y);
                pointer.render(dctx, pointer.color);
            }
        }else{
            x = ev.clientX - dc_x;
            y = ev.clientY - dc_y;
            pointer.update(x, y);
            pointer.render(dctx, pointer.color);
        }
        
        
        // sendToServer({
        //     type: 'drawing',
        //     vector: { x: x, y: y},
        //     size: pointer.size,
        //     color: pointer.color
        // })   
    }
    const pointerUp = (ev)=>{
        const { target } = ev;
        if(ev.pointerId){
            target.releasePointerCapture(ev.pointerId);
        }
        pointer.update(null,null);
        pointer.reset();
        target.removeEventListener(pointerEventNames.move, pointerMove);
        target.removeEventListener(pointerEventNames.end, pointerUp);
        
    }
    const pointerDown = (ev)=>{
        ev.preventDefault();
        const { target, clientX, clientY } = (ev.touches && ev.touches[0]) || ev;
        if(ev.pointerId) target.setPointerCapture(ev.pointerId);
        
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
        target.addEventListener(pointerEventNames.move, pointerMove);
        target.addEventListener(pointerEventNames.end, pointerUp);
    }
    // stop context menu from poping up when holding mouse down
    canvas.addEventListener('contextmenu', (ev)=> {
        ev.preventDefault();
    })
    canvas.addEventListener(pointerEventNames.start, pointerDown);
};

export { Pointer }