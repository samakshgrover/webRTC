import * as store from "./store.js";

let mediaRecorder;
const vp9Codec = "video/webm; codecs=vp9";
const vp9Options = { mimeType: vp9Codec };
const recorderChunk = [];

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;

  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  mediaRecorder.ondataavailable = handleDataAvailible;
  mediaRecorder.start();
};

export const pauseRecording = () => {
  mediaRecorder.pause();
};
export const resumeRecording = () => {
  mediaRecorder.resume();
};
export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  const blob = new Blob(recorderChunk, {
    type: "video/webm",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  document.body.appendChild(a);
  a.style = "display: none";
  a.download = "recording.webm";
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailible = (event) => {
  if (event.data.size > 0) {
    recorderChunk.push(event.data);
    downloadRecordedVideo();
  }
};
