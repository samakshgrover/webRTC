let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screeenSharingSteam: null,
  allowConnectionsFromStrangers: null,
  screenSharingActive: false,
};

export const setSocketId = (socketId) => {
  state = {
    ...state,
    socketId,
  };
};

export const setLocalStream = (stream) => {
  state = {
    ...state,
    localStream: stream,
  };
};
export const setAllowConnectionsFromStrangers = (alowConnections) => {
  state = {
    ...state,
    allowConnectionsFromStrangers: alowConnections,
  };
};

export const setScreeenSharingSteam = (stream) => {
  state = {
    ...state,
    screeenSharingSteam: stream,
  };
};

export const setScreenSharingActive = (screenSharingActive) => {
  state = {
    ...state,
    screenSharingActive,
  };
};

export const setRemoteStream = (stream) => {
  state = {
    ...state,
    remoteStream: stream,
  };
};

export const getState = () => {
  return state;
};
