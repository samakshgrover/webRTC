const express = require("express");
const http = require("http");

const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];

io.on("connection", (socket) => {
  connectedPeers.push(socket.id);

  console.log(connectedPeers);

  socket.on("pre-offer", (data) => {
    console.log("pre offer came");

    const { callType, calleePersonalCode } = data;
    if (connectedPeers.includes(calleePersonalCode)) {
      const data = {
        callerSocketId: socket.id,
        callType,
      };

      io.to(calleePersonalCode).emit("pre-offer", data);
    } else {
      const data = {
        preOfferAnswer: "CALLEE_NOT_FOUND",
      };
      io.to(socket.id).emit("pre-offer-answer", data);
    }
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("pre offer answer came");

    if (connectedPeers.includes(data.socketId)) {
      io.to(data.socketId).emit("pre-offer-answer", data);
    }
  });

  socket.on("webRTC-signaling", (data) => {
    const { connectedUserSocketId } = data;

    if (connectedPeers.includes(connectedUserSocketId)) {
      io.to(connectedUserSocketId).emit("webRTC-signaling", data);
    }
  });

  socket.on("user-hang-up", (data) => {
    const { connectedUserSocketId } = data;
    if (connectedPeers.includes(connectedUserSocketId)) {
      io.to(connectedUserSocketId).emit("user-hang-up");
    }
  });

  socket.on("disconnect", () => {
    connectedPeers = connectedPeers.filter((peer) => {
      return peer !== socket.id;
    });
    console.log(connectedPeers);
  });
});

server.listen(port, () => {
  console.log(`lisening on ${port}`);
});
