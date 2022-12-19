import Logo from "./../assets/logo.png";
import { useRoom } from "../features/room";
import { useGame } from "../features/game";

export default function Header() {
  const { createRoom, roomJoined, leaveRoom, roomId } = useRoom();
  const { isMultiplayer } = useGame();

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
        <>
          <button
            className="bg-red-500 text-white rounded px-6 py-4"
            onClick={leaveRoom}
          >
            Leave Room
          </button>
          <span>
            Room ID: <b>{roomId}</b>
          </span>
          <div className="animate-pulse">
            {isMultiplayer ? (
              <span className="text-emerald-500">Game has started!</span>
            ) : (
              <span className="text-gray-500">Didn't join yet!</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
