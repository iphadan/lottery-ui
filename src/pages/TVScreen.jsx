import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "../components/Celebration";
import { drawWinner, getActiveSession } from "../api/lotteryApi";

export default function TVScreen() {

  const [session, setSession] = useState(null);

  const [step, setStep] = useState("IDLE");
  const [winner, setWinner] = useState(null);
  const [display, setDisplay] = useState("------------");
  const [history, setHistory] = useState([]);
  const [count, setCount] = useState(0);

  // 🔄 LOAD ACTIVE SESSION
  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await getActiveSession();
        setSession(data);
      } catch (e) {
        console.error("Failed to load session");
      }
    };

    loadSession();
  }, []);

  // ❌ NO SESSION UI
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl text-red-400">
          ⚠ No Active Lottery Session
        </h1>
      </div>
    );
  }

  const maxWinners = session.maxWinners;

  // 🎯 START DRAW
  const startDraw = async () => {
    if (step !== "IDLE" || count >= maxWinners) return;

    setStep("SPINNING");

    // 🎰 spinning effect
    let interval = setInterval(() => {
      setDisplay(
        Math.floor(100000000000 + Math.random() * 900000000000).toString()
      );
    }, 50);

    try {
      // 🔥 CALL BACKEND IMMEDIATELY
      const data = await drawWinner();

      clearInterval(interval);

      const realNumber = data.number.toString();
      setWinner(data);

      setStep("REVEAL");

      // 🎬 DIGIT REVEAL ANIMATION
      let current = "";
      let index = 0;

      const revealInterval = setInterval(() => {
        current += realNumber[index];
        index++;

        setDisplay(
          current + "_".repeat(realNumber.length - current.length)
        );

        if (index === realNumber.length) {
          clearInterval(revealInterval);

          setTimeout(() => {
            setDisplay(realNumber);

            setHistory((h) => [
              ...h,
              {
                id: count + 1,
                number: realNumber,
              },
            ]);

            setStep("CELEBRATION");
          }, 500);
        }
      }, 200);

    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setStep("IDLE");
    }
  };

  // ➡ NEXT DRAW
  const nextDraw = () => {
    if (step !== "CELEBRATION") return;

    setStep("IDLE");
    setWinner(null);
    setDisplay("------------");
    setCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-950 border-b border-cyan-500">

        <img src="/logos/visa.png" className="h-10 object-contain" />

        <div className="flex items-center gap-4">
          <img src="/logos/usa-header.png" className="h-10" />
          <img src="/logos/mexico-header.webp" className="h-10" />
          <img src="/logos/canada-header.webp" className="h-10" />
        </div>

        <img src="/logos/cooperative.png" className="h-10 object-contain" />
      </div>

      {/* STAGE */}
      <div className="flex-1 flex flex-col items-center justify-center">

        <div className="text-lg mb-4 text-gray-400">
          Draw {count + 1} / {maxWinners}
        </div>

        {/* NUMBER DISPLAY */}
        <motion.div
          animate={{ scale: step === "SPINNING" ? 1.2 : 1 }}
          className="text-7xl font-bold text-cyan-400 mb-10 tracking-widest"
        >
          {display}
        </motion.div>

        {/* START BUTTON */}
        <button
          onClick={startDraw}
          disabled={step !== "IDLE" || count >= maxWinners}
          className="bg-yellow-500 text-black px-10 py-4 rounded-full text-2xl font-bold disabled:opacity-40"
        >
          {step === "SPINNING"
            ? "🎲 Drawing..."
            : step === "REVEAL"
            ? "🔢 Revealing..."
            : "🎯 START DRAW"}
        </button>

        {/* NEXT BUTTON */}
        {step === "CELEBRATION" && count < maxWinners - 1 && (
          <button
            onClick={nextDraw}
            className="mt-6 bg-green-500 text-black px-8 py-3 rounded-full font-bold"
          >
            ➡ NEXT DRAW
          </button>
        )}

        {/* HISTORY */}
        <div className="mt-10 space-y-2 w-80">
          {history.map((h) => (
            <div
              key={h.id}
              className="bg-gray-900 p-2 flex justify-between"
            >
              <span>Draw #{h.id}</span>
              <span className="text-cyan-300">{h.number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CELEBRATION */}
      <AnimatePresence>
        {step === "CELEBRATION" && winner && (
          <Celebration winner={winner} onNext={nextDraw} />
        )}
      </AnimatePresence>
    </div>
  );
}