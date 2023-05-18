import { ROOM } from "../room.js";
import { socket } from "../socket/socket.js";
import { createClientConnection } from "../webrtc/webrtc.js";
import { displayClientNotificationMessage } from "../../notifications/notification.js";
 
function muteClientVideo({currentTarget}){
    currentTarget.classList.toggle('selected');
   
    if(ROOM.CONNECTION.STREAM.LOCAL !== null){
        ROOM.CONNECTION.STREAM.LOCAL.getVideoTracks().forEach( track => {
            track.enabled = !track.enabled;
        });
        ROOM.VIDEO.MUTED = !ROOM.VIDEO.MUTED;
        // inform users that video has been muted
        socket.emit('muted',{
            type: 'video',
            muted: ROOM.VIDEO.MUTED,
            user: socket.user
        });
    }else{
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `No video connected`,
            message: `You can't mute something that does not exist.`,
            instructions: `Try connecting video...although, you shouldn't see this error...hmm`
        });
    }
};

function muteClientAudio({currentTarget}){
    currentTarget.classList.toggle('selected');

    if(ROOM.CONNECTION.STREAM.LOCAL !== null){
        ROOM.CONNECTION.STREAM.LOCAL.getAudioTracks().forEach( track => {
            track.enabled = !track.enabled;
        });
        ROOM.AUDIO.MUTED = ROOM.AUDIO.MUTED = !ROOM.AUDIO.MUTED;

        // inform users that audio has been muted
        socket.emit('muted',{
            type: 'audio',
            muted: ROOM.AUDIO.MUTED,
            user: socket.user
    });
    }else{
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `No video connected`,
            message: `You can't mute something that does not exist.`,
            instructions: `Try connecting video...although, you shouldn't see this error...hmm`
        });
    }
};

function stopAudioAndVideo(){
    if(ROOM.CONNECTION.STREAM.LOCAL !== null){
        ROOM.CONNECTION.STREAM.LOCAL.getTracks().forEach( track => {
            if(track.readyState == 'live'){
                track.stop();
            }
        });
        ROOM.VIDEO.CLIENT.src = null;
    }else{
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `No connection`,
            message: `Audio and video are not connected to stop.`,
            instructions: `Just leave room or try connecting video and audio.`
        });
    }
}

function activateSwitchVideoButtons(){
    ROOM.CONTROLS.MAIN_BUTTONS.forEach( button =>{
        if(!button.isEqualNode(ROOM.CONTROLS.MORE) && !button.isEqualNode(ROOM.CONTROLS.LEAVE_ROOM)){
            if(button.classList.contains('inactive')){
                button.classList.remove('inactive');
            }else{
                button.classList.add('inactive');
            }
        }
    });
}

function endVideoCall(){
    stopAudioAndVideo();

    socket.emit('end-call', {
        username: socket.user
    });
};
async function startVideoCall(){
    try{
        await createClientConnection();

        socket.emit('request-call', {
            username: socket.user
        });
    }catch(error){
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please refresh or reconnect device.`
        })
    }
   
};
function addVideoButtonListeners(){
    ROOM.CONTROLS.MUTE_VIDEO.addEventListener('click', muteClientVideo);
    ROOM.CONTROLS.MUTE_AUDIO.addEventListener('click', muteClientAudio);
    ROOM.CONTROLS.END_CALL.addEventListener('click', endVideoCall);
    ROOM.CONTROLS.START_CALL.addEventListener('click', startVideoCall);
};

export { 
    stopAudioAndVideo,
    activateSwitchVideoButtons,
    addVideoButtonListeners
 };