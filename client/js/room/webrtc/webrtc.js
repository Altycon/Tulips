
import { displayClientNotificationMessage } from "../../notifications/notification.js";
import { ROOM, addRoomNotification } from "../room.js";
import { socket } from "../socket/socket.js";
import { activateSwitchVideoButtons } from "../video/video_controls.js";

function getIceErrorMessage(code) {
    switch (code) {
        case '300':
            return `ICE Error: Try alternate...`;
        case '400':
            return `ICE Error: Bad Request`;
        case '401':
            return `ICE Error: Unauthenticated`;
        case '403':
            return `ICE Error: Forbidden`;
        case '405':
            return `ICE Error: Mobility Forbidden`;
        case '420':
            return `ICE Error: Unknown Attribute`;
        case '437':
            return `ICE Error: Allocation Mismatch`;
        case '438':
            return `ICE Error: Stale Nonce (Bad authentication)`;
        case '440':
            return `ICE Error: Address Family not Supported`;
        case '441':
            return `ICE Error: Wrong Credentials`;
        case '442':
            return `ICE Error: Unsupported Transport Protocol`;
        case '443':
            return `ICE Error: Peer Address Family Mismatch`;
        case '446':
            return `ICE Error: Connection Already Exists`;
        case '447':
            return `ICE Error: Connection Timeout or Failure`;
        case' 486':
            return `ICE Error: Allocation Quota Reached`;
        case '487':
            return `ICE Error: Role Conflict`;
        case '500':
            return `ICE Error: Server Error`;
        case '508':
            return `ICE Error: Insufficient Capacity`;
        default:
            return `ICE Error: Unknown Error occurred`;
    }
}


async function createClientConnection() {
    try {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            ROOM.CONNECTION.STREAM.LOCAL = await navigator.mediaDevices.getUserMedia(ROOM.CONNECTION.MEDIA_CONSTRANTS);
            ROOM.VIDEO.CLIENT.srcObject = ROOM.CONNECTION.STREAM.LOCAL;
        }
    } catch (error) {
        throw error;
    }
};
async function createPeerConnection() {
    try {
        // connect stun servers and peer with WebRTC
        ROOM.CONNECTION.PEER = new RTCPeerConnection(ROOM.CONNECTION.SERVERS);
        // get peer media stream
        ROOM.CONNECTION.STREAM.REMOTE = new MediaStream();

        // add peer video to element
        ROOM.VIDEO.PEER.srcObject = ROOM.CONNECTION.STREAM.REMOTE;
        //ROOM.VIDEO.PEER.style.display = 'block';

        // make sure local stream exists
        if (!ROOM.CONNECTION.STREAM.LOCAL) {
            await createClientConnection();
        };
        ROOM.CONNECTION.STREAM.LOCAL.getTracks().forEach(track => {
            ROOM.CONNECTION.PEER.addTrack(track, ROOM.CONNECTION.STREAM.LOCAL);
        });

        ROOM.CONNECTION.PEER.addEventListener('track', (ev) => {
            ev.streams[0].getTracks().forEach(track => {
                ROOM.CONNECTION.STREAM.REMOTE.addTrack(track);
            });
        });

        // setup ICE candidates
        ROOM.CONNECTION.PEER.addEventListener('icecandidate', (ev) => {
            if (ev.candidate) {
                socket.emit('candidate', {
                    candidate: ev.candidate
                });
            };
        })

        ROOM.CONNECTION.PEER.addEventListener('icecandidateerror', (ev) => {
            const ice_error = getIceErrorMessage(ev.errorCode);
            addRoomNotification(ice_error);
        });
    } catch (error) {
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please wait a few moments and try connecting again.`
        });
    }
};

async function createOffer() {
    try {
        await createPeerConnection();

        // create offer
        const offer = await ROOM.CONNECTION.PEER.createOffer({ iceRestart: true }); // <--{iceRestart: true} ?

        // set local description. Once set, onicecandidate event fires
        await ROOM.CONNECTION.PEER.setLocalDescription(offer)

        // send offer to signaling server (websocket)
        socket.emit('offer', {
            offer: offer
        });

    } catch (error) {
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please wait a few moments and try connecting again.`
        })
    }
};

async function createAnswer(offer) {
    try {
        await createPeerConnection();

        await ROOM.CONNECTION.PEER.setRemoteDescription(offer);

        const answer = await ROOM.CONNECTION.PEER.createAnswer();
        await ROOM.CONNECTION.PEER.setLocalDescription(answer);

        socket.emit('answer', {
            answer: answer
        });

        activateSwitchVideoButtons();
        addRoomNotification('Video connection established.');

    } catch (error) {
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please wait a few moments and try connecting again.`
        })
    }
};
async function addAnswer(answer) {
    try {
        if (!ROOM.CONNECTION.PEER.currentRemoteDescription) {
            await ROOM.CONNECTION.PEER.setRemoteDescription(answer);
            activateSwitchVideoButtons();
            addRoomNotification('Video connection established.');
        }
    } catch (error) {
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please wait a few moments and try connecting again.`
        })
    }
};

function addCandidate(candidate) {
    try {
        if (ROOM.CONNECTION.PEER && ROOM.CONNECTION.PEER.currentRemoteDescription) {
            ROOM.CONNECTION.PEER.addIceCandidate(new RTCIceCandidate(candidate));
        }
    } catch (error) {
        displayClientNotificationMessage(ROOM.NOTIFICATION.MAIN, {
            title: `${error.name}`,
            message: `${error.message}`,
            instructions: `Please wait a few moments and try connecting again.`
        });
    }
};

export {
    createClientConnection,
    createOffer,
    createAnswer,
    addAnswer,
    addCandidate
};