import { useGame } from "../features/game";

const GuessHistoryBoard = () => {
  const { guessHistory, isMultiplayer } = useGame();

  return (
    <div>
      <table className="w-[250px] border">
        <thead>
          <tr className="border">
            <th className="border text-red-400">Senin Tahminin</th>
            <th className="border p-2">+</th>
            <th className="p-2">-</th>
          </tr>
        </thead>

        <tbody>
          {guessHistory.map((item, index) => (
            <tr className="border" key={index}>
              <th className="border">{item.number}</th>
              <th className="border">{item.plus}</th>
              <th className="border">{item.minus}</th>
            </tr>
          ))}
        </tbody>
      </table>
      {isMultiplayer && <span className="text-red-500">Rakippp!</span>}
    </div>
  );
};

export default GuessHistoryBoard;
