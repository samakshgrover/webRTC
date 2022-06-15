import * as wss from "./wss.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as store from "./store.js";

let connectedUserDetails;
let PeerConnection;
let dataChannel;

const defaultConstrains = {
  audio: true,
  video: true,
};

const configuration = {
  iceServer: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstrains)
    .then((stream) => {
      ui.updateLocalVideo(stream);
      store.setLocalStream(stream);
    })
    .catch((err) => {
      console.log("Error occured while trying to get access to camera");
      console.log(err);
    });
};

const createPeerConnection = () => {
  PeerConnection = new RTCPeerConnection(configuration);
  dataChannel = PeerConnection.createDataChannel("chat");

  PeerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;

    dataChannel.onopen = () => {
      console.log("peer connection is ready to recive data channel messages");
    };
    dataChannel.onmessage = (event) => {
      console.log("message came from data channel");
      const message = JSON.parse(event.data);
      ui.appendMessage(message);
    };
  };

  PeerConnection.onicecandidate = (event) => {
    console.log("getting ice candidate from stun server");
    if (event.candidate) {
      // send ice to other peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignalin.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  PeerConnection.onconnectionstatechange = (event) => {
    if (PeerConnection.connectionState === "connected") {
      console.log("successfully connected with other peer");
    }
  };

  // reciving tracks
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  PeerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // add our stream to peer connection
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;

    for (const track of localStream.getTracks()) {
      PeerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

const callingDialogRectectHandler = () => {
  console.log("rejecting the call");
};

const acceptCallHandler = () => {
  console.log("call accepted");
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  console.log("call rejected");
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    socketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialog();
  wss.sendPreOfferAnswer(data);
};

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  };
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      calleePersonalCode,
    };
    ui.showCallingDialog(callingDialogRectectHandler);
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;
  connectedUserDetails = {
    callType,
    socketId: callerSocketId,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler);
  }
};

export const handlePreOfferAnswer = (data) => {
  console.log("pre offer answer came");
  ui.removeAllDialog();
  const { preOfferAnswer } = data;
  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    // showing a message that callee not found
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVILIBLE) {
    // showing a message that callee Unavailible
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    console.log(preOfferAnswer);
    // showing a message that call is rejected
    ui.showInfoDialog(preOfferAnswer);
  }
  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    ui.showCallElements(connectedUserDetails.callType);
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendWebRTCOffer = async () => {
  const offer = await PeerConnection.createOffer();
  await PeerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignalin.OFFER,
    offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  console.log("webRTC Offer Came");
  await PeerConnection.setRemoteDescription(data.offer);
  const answer = await PeerConnection.createAnswer();
  await PeerConnection.setLocalDescription(answer);

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignalin.ANSWER,
    answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  console.log("handling webRTC answer");
  await PeerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  try {
    console.log("handling incoming ice canddidates");
    await PeerConnection.addIceCandidate(data.candidate);
  } catch (err) {
    console.error("error occured when trying to recive ICE candidate");
    console.error(err);
  }
};

let screenSharingStream;

export const swithBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  console.log(screenSharingActive);
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = PeerConnection.getSenders();
    const sender = senders.find((sender) => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });
    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    store
      .getState()
      .screeenSharingSteam.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!screenSharingActive);
    ui.updateLocalVideo(localStream);
  } else {
    console.log("switching for screen sharing");
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreeenSharingSteam(screenSharingStream);

      //replace tracks which sender is sending
      const senders = PeerConnection.getSenders();

      const sender = senders.find((sender) => {
        return (
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
        );
      });
      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      store.setScreenSharingActive(!screenSharingActive);
      ui.updateLocalVideo(screenSharingStream);
    } catch (err) {
      console.error("error occcured while trying screen sharing", err);
    }
  }
};

// HangUp
export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  wss.sendUserHangUp(data);
  closePeerConnectionAndResetState();
};

export const handleConnectedUserHangUp = () => {
  closePeerConnectionAndResetState();
};

const closePeerConnectionAndResetState = () => {
  if (PeerConnection) {
    PeerConnection.close();
    PeerConnection = null;
  }
  // Active mic and camera
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }
  ui.updateUiAfterHangUp(connectedUserDetails.callType);
  connectedUserDetails = null;
};
