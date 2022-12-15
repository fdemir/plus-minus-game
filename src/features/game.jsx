import { useEffect, useState } from "react";
import { createContext } from "react";
import createRandomNumber from "../helper/randomNumber";
import { GameOverScreen } from "../components/GameOverScreen";
import { useContext } from "react";

const GameContext = createContext({
  isMultiplayer: false,
  setIsMultiplayer: () => {},
  currentGuess: "",
  guessHistory: [],
  secretNumber: 0,
  setGuess: () => {},
  setSecretNumber: () => {},
  gameOver: false,
  setGameOver: () => {},
  resetGame: () => {},
});

export const GameProvider = ({ children }) => {
  const [currentGuess, setGuess] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [secretNumber, setSecretNumber] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  // REFACTOR:
  const isNumberValid = () => {
    if (currentGuess.length !== 5) {
      alert("Lütfen 5 basamaklı bir sayı giriniz");
      return false;
    }

    const unique = Number(Array.from(new Set([...currentGuess])).join(""));

    if (unique !== Number(currentGuess)) {
      alert("Lütfen her basamağı benzersiz rakamlardan oluşturun");
      return false;
    }

    return true;
  };

  const handleGuess = () => {
    if (!isNumberValid()) return;

    let plus = 0;
    let minus = 0;

    for (let i = 0; i < currentGuess.length; i++) {
      let location = secretNumber.toString().indexOf(currentGuess[i]);
      if (location === i) {
        plus += 1;
      } else if (location > -1) {
        minus += 1;
      }
    }

    setGuessHistory([
      ...guessHistory,
      { number: currentGuess, plus: plus, minus: minus },
    ]);

    if (secretNumber === +currentGuess) {
      alert("Tebrikler Kazandınız");
      resetGame();
      return;
    }

    setGuess("");
  };
  const generateNewSecretNumber = () => {
    setSecretNumber(createRandomNumber(5));
  };

  useEffect(() => {
    generateNewSecretNumber();
  }, []);

  const resetGame = () => {
    setGuess("");
    setGuessHistory([]);
    setGameOver(false);
    generateNewSecretNumber();
  };

  const value = {
    currentGuess,
    guessHistory,
    secretNumber,
    setGuess,
    setSecretNumber,
    gameOver,
    setGameOver,
    resetGame,
    isNumberValid,
    handleGuess,
    isMultiplayer,
    setIsMultiplayer,
  };

  if (gameOver) return <GameOverScreen resetGame={resetGame} />;

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);

export default GameContext;
