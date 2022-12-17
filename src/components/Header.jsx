import Logo from "./../assets/logo.png";
import { useRoom } from "../features/room";

export default function Header() {
  const { createRoom, roomJoined, leaveRoom } = useRoom();

  return (
    <div>
      <img src={Logo} alt="" className="mb-4" />
      <button
        className="bg-indigo-500 text-white rounded px-6 py-4"
        onClick={createRoom}
        disabled={roomJoined}
      >
        Create Room
      </button>

      {roomJoined && (
        <button
          className="bg-red-500 text-white rounded px-6 py-4"
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      )}
    </div>
  );
}
