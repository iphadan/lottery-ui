import { useState } from "react";
import { drawWinner } from "../api/lotteryApi";
import Celebration from "./Celebration";

export default function DrawPanel({ session }) {
  const [display, setDisplay] = useState("-----");
  const [winner, setWinner] = useState(null);
  const [step, setStep] = useState("IDLE");
  const [history, setHistory] = useState([]);

  const startDraw = async () => {
    setStep("SPINNING");

    let interval = setInterval(() => {
      setDisplay(Math.floor(10000 + Math.random() * 90000));
    }, 60);

    setTimeout(async () => {
      clearInterval(interval);

      const data = await drawWinner();

      setDisplay(data.number);
      setWinner(data);
      setHistory((h) => [...h, data]);

      setStep("CELEBRATION");
    }, 2000);
  };

  const next = () => {
    setStep("IDLE");
    setWinner(null);
    setDisplay("-----");
  };

  return (
    <div className="bg-gray-800 p-6 rounded text-center">

      <h2 className="text-xl mb-4">🎰 Draw</h2>

      <div className="text-5xl text-yellow-400 mb-4">
        {display}
      </div>

      <button
        onClick={startDraw}
        className="bg-green-500 px-6 py-3 text-black font-bold"
      >
        START DRAW
      </button>

      <div className="mt-4 text-left">
        {history.map((h, i) => (
          <div key={i}>
            #{i + 1} → {h.number}
          </div>
        ))}
      </div>

      {step === "CELEBRATION" && (
        <Celebration winner={winner} onNext={next} />
      )}

    </div>
  );
}