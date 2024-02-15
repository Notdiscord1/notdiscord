// script.js
let localStream;
let remoteStream;
let peerConnection;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

async function startCall() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStream = stream;
        document.getElementById('localVideo').srcObject = stream;

        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addEventListener('track', gotRemoteStream);
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to signaling server
        // signalingServer.send(offer);

        document.getElementById('startButton').disabled = true;
        document.getElementById('endButton').disabled = false;
    } catch (error) {
        console.error('Failed to start call:', error);
    }
}

async function endCall() {
    try {
        localStream.getTracks().forEach(track => track.stop());
        peerConnection.close();

        document.getElementById('localVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;

        document.getElementById('startButton').disabled = false;
        document.getElementById('endButton').disabled = true;
    } catch (error) {
        console.error('Failed to end call:', error);
    }
}

function gotRemoteStream(event) {
    if (!remoteStream) {
        remoteStream = new MediaStream();
        document.getElementById('remoteVideo').srcObject = remoteStream;
    }
    remoteStream.addTrack(event.track);
}
