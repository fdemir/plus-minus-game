import express from "express";
import http from "http";
import cors from "cors";
import createRandomNumber from "../src/helper/randomNumber.js";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

app.use("/", express.static("dist"));

io.on("connection", (socket) => {
  // REFACTOR: this is a mess
  const leaveRoom = () => {
    for (const room in rooms) {
      if (rooms[room].players.includes(socket.id)) {
        socket.broadcast.to(room).emit("player-disconnected", socket.id);
        // TODO: if there is a user in that room, then emit the event
        rooms[room].players = rooms[room].players.filter(
          (player) => player !== socket.id,
        );
        if (rooms[room].players.length === 0) {
          delete rooms[room];
        }
      }
    }
  };

  socket.on("leave-room", () => {
    leaveRoom();
  });

  socket.on("join-room", (room) => {
    if (rooms[room]?.players.length == 2) {
      socket.emit("room-not-avaliable");
      return;
    }

    if (!rooms[room]) {
      rooms[room] = {
        guessHistory: [],
        players: [],
        secretNumber: createRandomNumber(5),
      };
    }

    rooms[room].players.push(socket.id);

    socket.join(room);
    socket.broadcast.to(room).emit("player-joined", socket.id);
    console.log(rooms[room]);
  });

  socket.on("disconnect", () => {
    leaveRoom();
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
