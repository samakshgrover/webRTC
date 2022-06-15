export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log("getting incoming call dialog");

  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Incoming ${callTypeInfo} call`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  image.src = "./utils/images/dialogAvatar.png";
  imageContainer.appendChild(image);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  const acceptCallButton = document.createElement("button");
  acceptCallButton.classList.add("dialog_accept_call_button");

  const acceptCallImg = document.createElement("img");
  acceptCallImg.classList.add("dialog_button_image");
  acceptCallImg.src = "./utils/images/acceptCall.png";
  acceptCallButton.appendChild(acceptCallImg);

  const rejectCallButton = document.createElement("button");
  rejectCallButton.classList.add("dialog_reject_call_button");

  const rejectCallImg = document.createElement("img");
  rejectCallImg.classList.add("dialog_button_image");
  rejectCallImg.src = "./utils/images/rejectCall.png";
  rejectCallButton.appendChild(rejectCallImg);

  buttonContainer.appendChild(acceptCallButton);
  buttonContainer.appendChild(rejectCallButton);

  dialog.appendChild(dialogContent);
  dialogContent.appendChild(title);
  dialogContent.appendChild(image);
  dialogContent.appendChild(buttonContainer);

  acceptCallButton.addEventListener("click", () => {
    acceptCallHandler();
  });

  rejectCallButton.addEventListener("click", () => {
    rejectCallHandler();
  });

  return dialog;
};

export const getCallingDialog = (rejectCallHandler) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = `Calling`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  image.src = "./utils/images/dialogAvatar.png";
  imageContainer.appendChild(image);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("dialog_button_container");

  const hangUpButton = document.createElement("button");
  hangUpButton.classList.add("dialog_reject_call_button");

  const hangUpCallImg = document.createElement("img");
  hangUpCallImg.classList.add("dialog_button_image");
  hangUpCallImg.src = "./utils/images/hangUp.png";
  hangUpButton.appendChild(hangUpCallImg);

  buttonContainer.appendChild(hangUpButton);

  dialog.appendChild(dialogContent);
  dialogContent.appendChild(title);
  dialogContent.appendChild(image);
  dialogContent.appendChild(buttonContainer);

  return dialog;
};

export const getInfoDialog = (dialogTitle, descriptionText) => {
  const dialog = document.createElement("div");
  dialog.classList.add("dialog_wrapper");

  const dialogContent = document.createElement("div");
  dialogContent.classList.add("dialog_content");

  const title = document.createElement("p");
  title.classList.add("dialog_title");
  title.innerHTML = dialogTitle;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("dialog_image_container");
  const image = document.createElement("img");
  image.src = "./utils/images/dialogAvatar.png";
  imageContainer.appendChild(image);

  const description = document.createElement("p");
  description.classList.add("dialog_description");
  description.innerHTML = descriptionText;

  dialog.appendChild(dialogContent);
  dialogContent.appendChild(title);
  dialogContent.appendChild(image);
  dialogContent.appendChild(description);

  return dialog;
};

export const getLeftMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_left_container");
  
  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_left_paragraph");
  messageParagraph.innerHTML = message;

  messageContainer.appendChild(messageParagraph);
  return messageContainer;
};
export const getRightMessage = (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message_right_container");

  const messageParagraph = document.createElement("p");
  messageParagraph.classList.add("message_right_paragraph");
  messageParagraph.innerHTML = message;

  messageContainer.appendChild(messageParagraph);
  return messageContainer;
};

