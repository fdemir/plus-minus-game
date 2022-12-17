import { useEffect, useState, useRef, useContext } from "react";
import { createContext } from "react";
import io from "socket.io-client";
import { useGame } from "./game";
import { useMemo } from "react";

const RoomContext = createContext({
  roomId: "",
  setRoomId: () => {},

  createRoom: (str) => {},
  leaveRoom: () => {},
  roomJoined: false,
});

export const RoomProvider = ({ children }) => {
  const socket = useRef(null);
  const [roomId, setRoomId] = useState("");
  const { setIsMultiplayer, resetGame } = useGame();
  const roomJoined = useMemo(() => roomId?.length > 0, [roomId]);

  const joinRoom = (targetRoomId) => {
    socket.current.emit("join-room", targetRoomId);
    setRoomId(targetRoomId);
  };

  const leaveRoom = () => {
    socket.current.emit("leave-room");
    window.location.hash = "";
    setRoomId("");
  };

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      const currentRoomId = window.location.hash.substring(1);
      if (currentRoomId?.length > 0) {
        joinRoom(currentRoomId);
      }
    });

    socket.current.on("room-not-avaliable", () => {
      window.location.hash = "";
      alert("Room not available!");
      leaveRoom();
    });

    socket.current.on("player-joined", () => {
      setIsMultiplayer(true);
    });

    socket.current.on("player-disconnected", resetGame);
  }, []);

  const createRoom = () => {
    // FIXME: This is not a good way to generate a random room id.
    const randomRoomId = Math.random().toString(36).substring(7);
    const newRoomId = `room-${randomRoomId}`;
    window.location.hash = `#${newRoomId}`;
    joinRoom(newRoomId);
  };

  const value = { roomId, setRoomId, createRoom, roomJoined, leaveRoom };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => useContext(RoomContext);
