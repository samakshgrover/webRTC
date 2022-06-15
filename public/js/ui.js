import * as constants from "./constants.js";
import * as elements from "./elements.js";

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  // console.log(stream.play());
  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = stream;
};

const personalCodeParagraph = document.getElementById(
  "personal_code_paragraph"
);

export const updatePersonalCode = (personalCode) => {
  personalCodeParagraph.innerHTML = personalCode;
};

export const showIncomingCallDialog = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "Chat" : "Video";

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
  dialog.appendChild(incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.getCallingDialog(rejectCallHandler);

  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());

  dialog.appendChild(callingDialog);
};

export const removeAllDialog = () => {
  const dialog = document.getElementById("dialog");
  dialog.querySelectorAll("*").forEach((dialog) => dialog.remove());
};

export const showInfoDialog = (preOfferAnswer) => {
  let infoDialog;

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog(
      "Call Rejected",
      "Callee Rejected Your Call"
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog(
      "Callee Not Found",
      "Please Check Personal Code"
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVILIBLE) {
    infoDialog = elements.getInfoDialog(
      "Call not possible",
      "Cann't connect right now, please try again later"
    );
  }

  if (infoDialog) {
    const dialog = document.getElementById("dialog");
    dialog.appendChild(infoDialog);

    setTimeout(() => {
      removeAllDialog();
    }, [4000]);
  }
};

export const showCallElements = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  }
  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    showVideoCallElements();
  }
};

const showChatCallElements = () => {
  //show Elements
  const finishConnectionChatButtonContainer = document.getElementById(
    "finish_chat_button_container"
  );
  showElement(finishConnectionChatButtonContainer);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  // block dashboard
  disableDashboard();
};

const showVideoCallElements = () => {
  const callButtons = document.getElementById("call_buttons");
  showElement(callButtons);

  const videoHolder = document.getElementById("video_placeholder");
  hideElement(videoHolder);

  const remoteVideo = document.getElementById("remote_video");
  showElement(remoteVideo);

  const newMessageInput = document.getElementById("new_message");
  showElement(newMessageInput);
  // block dashboard
  disableDashboard();
};
//ui call buttons
const micOnImg = "./utils/images/mic.png";
const micOffImg = "./utils/images/micOff.png";

export const updateMicButton = (micActive) => {
  const micButtonImage = document.getElementById("mic_button_image");
  micButtonImage.src = micActive ? micOffImg : micOnImg;
};

const cameraOn = "./utils/images/camera.png";
const cameraOff = "./utils/images/cameraOff.png";

export const updateCameraButton = (cameraActive) => {
  const cameraButtonImage = document.getElementById("camera_button_image");
  cameraButtonImage.src = cameraActive ? cameraOff : cameraOn;
};

//ui messages
export const appendMessage = (message, right = false) => {
  const messageContainer = document.getElementById("messages_container");
  const messageElement = right
    ? elements.getRightMessage(message)
    : elements.getLeftMessage(message);

  messageContainer.appendChild(messageElement);
};

export const removeMessage = () => {
  const messageContainer = document.getElementById("messages_container");
  messageContainer.querySelectorAll("*").forEach((n) => n.remove());
};
//recording

export const showRecordingPannel = () => {
  const recordingButtons = document.getElementById("video_recording_buttons");
  showElement(recordingButtons);

  //hide start recording button if it is active
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  hideElement(startRecordingButton);
};

export const resetRecordeingButton = () => {
  const startRecordingButton = document.getElementById(
    "start_recording_button"
  );
  const recordingButtons = document.getElementById("video_recording_buttons");
  showElement(startRecordingButton);
  hideElement(recordingButtons);
};

export const switchRecordingButtons = (switchForResumeButton = false) => {
  const resumeButton = document.getElementById("resume_recording_button");
  const pauseButton = document.getElementById("pause_recording_button");

  if (switchForResumeButton) {
    console.log("-------------------");
    hideElement(pauseButton);
    showElement(resumeButton);
  } else {
    console.log("++++++++++++++++++++");
    hideElement(resumeButton);
    showElement(pauseButton);
  }
};

export const updateUiAfterHangUp = (callType) => {
  enableDashboard();

  //hide the call buttons
  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const callButtons = document.getElementById("call_buttons");
    hideElement(callButtons);
  } else {
    const chatCallButton = document.getElementById(
      "finish_chat_button_container"
    );
    hideElement(chatCallButton);
  }
  const newMessageInput = document.getElementById("new_message");
  hideElement(newMessageInput);

  // clear messanger
  removeMessage();
  updateMicButton(false);
  updateCameraButton(false);

  //hide remoteVideo and show Placeholder
  const remoteVideo = document.getElementById("remote_video");
  hideElement(remoteVideo);

  const Placeholder = document.getElementById("video_placeholder");
  showElement(Placeholder);

  removeAllDialog();
};
// helper functions

const enableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");

  if (!dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.add("display_none");
  }
};

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById("dashboard_blur");

  if (dashboardBlocker.classList.contains("display_none")) {
    dashboardBlocker.classList.remove("display_none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display_none")) {
    element.classList.add("display_none");
  }
};
const showElement = (element) => {
  if (element.classList.contains("display_none")) {
    element.classList.remove("display_none");
  }
};
