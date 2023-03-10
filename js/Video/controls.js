import { ROOM } from "../room.js";

function muteClientVideo({currentTarget}){
    currentTarget.classList.toggle('selected');
    // if(CONNECTION.STREAM.LOCAL !== null){
    //     CONNECTION.STREAM.LOCAL.getVideoTracks().forEach( track => {
    //         track.enabled = !track.enabled;
    //     })
    // }
    
    console.log(ROOM.VIDEO.CLIENT.srcObject)  // <-- for testing
    if(ROOM.VIDEO.CLIENT.srcObject !== null){
        ROOM.VIDEO.CLIENT.srcObject.getVideoTracks().forEach( track => {
            track.enabled = !track.enabled;
        })
    }
};

function muteClientAudio({currentTarget}){
    currentTarget.classList.toggle('selected');
    // if(CONNECTION.STREAM.LOCAL !== null){
    //     CONNECTION.STREAM.LOCAL.getAudioTracks().forEach( track => {
    //         track.enabled = !track.enabled;
    //     })
    // }

    if(ROOM.VIDEO.CLIENT.srcObject !== null){
        ROOM.VIDEO.CLIENT.srcObject.getAudioTracks().forEach( track => {
            track.enabled = !track.enabled;
        })
    }
};
function endVideoCall(ev){
    const { target } = ev;
    console.log('End Call here', target);
};
function addVideoButtonListeners(){
    ROOM.CONTROLS.MUTE_VIDEO.addEventListener('click', muteClientVideo);
    ROOM.CONTROLS.MUTE_AUDIO.addEventListener('click', muteClientAudio);
    ROOM.CONTROLS.END_CALL.addEventListener('click', endVideoCall);
};

export { addVideoButtonListeners };