import express from "express";
import http from "http";
import createRandomNumber from "../src/helper/randomNumber.js";

const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5174",
    methods: ["GET", "POST"],
  },
});

const rooms = {};

app.use("/", express.static("dist"));

io.on("connection", (socket) => {
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

  // REFACTOR: this is a mess
  socket.on("disconnect", () => {
    for (const room in rooms) {
      if (rooms[room].players.includes(socket.id)) {
        socket.broadcast.to(room).emit("player-disconnected", socket.id);
        rooms[room].players = rooms[room].players.filter(
          (player) => player !== socket.id,
        );
        if (rooms[room].players.length === 0) {
          delete rooms[room];
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
