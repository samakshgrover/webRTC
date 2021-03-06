import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";

let socketIO;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    console.log("successfully connected");
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('user-hang-up', ()=>{
    webRTCHandler.handleConnectedUserHangUp()
  })

  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignalin.OFFER: {
        webRTCHandler.handleWebRTCOffer(data);
        break;
      }
      case constants.webRTCSignalin.ANSWER: {
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      }
      case constants.webRTCSignalin.ICE_CANDIDATE: {
        webRTCHandler.handleWebRTCCandidate(data);
      }
      default: {
        return;
      }
    }
  });
};

export const sendPreOffer = (data) => {
  console.log("pre-offer-send");
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};

export const sendUserHangUp = (data) => {
  socketIO.emit('user-hang-up', data);
};
