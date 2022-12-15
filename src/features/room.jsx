import { useEffect, useState, useRef, useContext } from "react";
import { createContext } from "react";
import io from "socket.io-client";
import { useGame } from "./game";

const RoomContext = createContext({
  roomId: "",
  setRoomId: () => {},

  createRoom: () => {},
});

export const RoomProvider = ({ children }) => {
  const socket = useRef(null);
  const [roomId, setRoomId] = useState("");
  const { setIsMultiplayer } = useGame();

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      if (window.location.hash) {
        const roomName = window.location.hash.substring(1);
        socket.current.emit("join-room", roomName);
      }
    });

    socket.current.on("room-not-avaliable", () => {
      window.location.hash = "";
      alert("Room not available!");
    });

    socket.current.on("player-joined", () => {
      setIsMultiplayer(true);
    });
  }, []);

  const createRoom = () => {
    // FIXME: This is not a good way to generate a random room id.
    const randomRoomId = Math.random().toString(36).substring(7);
    const roomName = `room-${randomRoomId}`;
    window.location.hash = `#${roomName}`;
    socket.current.emit("join-room", roomName);
  };

  return (
    <RoomContext.Provider value={{ roomId, setRoomId, createRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);
