import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";
import * as ui from "./ui.js";
import * as recordingUtils from "./recordingUtils.js";

//initializing socket connection
const socket = io("/");
wss.registerSocketEvents(socket);
webRTCHandler.getLocalPreview();

//register event on personal code copy button

const personal_code_copy_button = document.getElementById(
  "personal_code_copy_button"
);

personal_code_copy_button.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

const personal_code_chat_button = document.getElementById(
  "personal_code_chat_button"
);

personal_code_chat_button.addEventListener("click", () => {
  console.log("clicked chat button");

  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

const personal_code_video_button = document.getElementById(
  "personal_code_video_button"
);

personal_code_video_button.addEventListener("click", () => {
  console.log("clicked video button");

  const calleePersonalCode = document.getElementById(
    "personal_code_input"
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

//event listener for video call buttons

const micButton = document.getElementById("mic_button");
micButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const micEnable = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnable;
  ui.updateMicButton(micEnable);
});

const cameraButton = document.getElementById("camera_button");
cameraButton.addEventListener("click", () => {
  const localStream = store.getState().localStream;
  const cameraEnable = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnable;
  ui.updateCameraButton(cameraEnable);
});

const screenSharingButton = document.getElementById("screen_sharing_button");
screenSharingButton.addEventListener("click", () => {
  const screenSharingActive = store.getState().screenSharingActive;
  webRTCHandler.swithBetweenCameraAndScreenSharing(screenSharingActive);
});

// messanger

const newMessageInput = document.getElementById("new_message_input");
newMessageInput.addEventListener("keydown", (event) => {
  console.log("change occured");

  const key = event.key;
  if (key === "Enter") {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    ui.appendMessage(event.target.value, true);
    newMessageInput.value = "";
  }
});

const sendMessageButton = document.getElementById("send_message_button");
sendMessageButton.addEventListener("click", () => {
  const message = newMessageInput.value;
  webRTCHandler.sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  newMessageInput.value = "";
});

const startRecordingButton = document.getElementById("start_recording_button");
startRecordingButton.addEventListener("click", () => {
  recordingUtils.startRecording();
  ui.showRecordingPannel();
});

const stopRecordingButton = document.getElementById("stop_recording_button");
stopRecordingButton.addEventListener("click", () => {
  recordingUtils.stopRecording();
  ui.resetRecordeingButton();
});

const pauseButton = document.getElementById("pause_recording_button");
pauseButton.addEventListener("click", () => {
  recordingUtils.pauseRecording();
  ui.switchRecordingButtons(true);
});

const resumeButton = document.getElementById("resume_recording_button");
resumeButton.addEventListener("click", () => {
  recordingUtils.resumeRecording();
  ui.switchRecordingButtons();
});

const hangUpButton = document.getElementById("hang_up_button");
hangUpButton.addEventListener("click", () => webRTCHandler.handleHangUp());

const hangUpChatButton = document.getElementById("finish_chat_call_button");
hangUpChatButton.addEventListener('click', ()=> webRTCHandler.handleHangUp())