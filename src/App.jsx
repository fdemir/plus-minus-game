import { useEffect } from "react";
import { GameProvider } from "./features/game";
import Header from "./components/Header";
import Left from "./components/Left";
import GuessHistoryBoard from "./components/GuessHistoryBoard";

import { RoomProvider } from "./features/room";

const App = () => {
  return (
    <GameProvider>
      <RoomProvider>
        <div className="container mx-auto flex flex-col items-center my-8">
          <div>
            <Header />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-start mt-8 gap-4">
            <Left />
            <GuessHistoryBoard />
          </div>
        </div>
      </RoomProvider>
    </GameProvider>
  );
};

export default App;
