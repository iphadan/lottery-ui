import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Celebration from "../components/Celebration";
import {
  drawWinner,
  getActiveSession,
  getResults,
} from "../api/lotteryApi";

export default function TVScreen() {
  const [session, setSession] = useState(null);

  const [step, setStep] = useState("IDLE");
  const [winner, setWinner] = useState(null);
  const [display, setDisplay] = useState("------------");
  const [history, setHistory] = useState([]);
  const [count, setCount] = useState(0);

  // 🔄 LOAD SESSION + HISTORY
  useEffect(() => {
    const load = async () => {
      try {
        const s = await getActiveSession();
        setSession(s);

        if (s?.id) {
          const results = await getResults(s.id);

          const formatted = results.map((r, i) => ({
            id: i + 1,
            number: r.lotteryNumber.number,
          }));

          setHistory(formatted);
          setCount(formatted.length);
        }
      } catch (e) {
        console.error("Init failed");
      }
    };

    load();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        ⚠ No Active Session
      </div>
    );
  }

  const maxWinners = session.maxWinners;

  // 🎯 DRAMATIC DRAW
  const startDraw = async () => {
    if (step !== "IDLE" || count >= maxWinners) return;

    setStep("SPINNING");

    let interval = setInterval(() => {
      setDisplay(
        Math.floor(100000000000 + Math.random() * 900000000000).toString()
      );
    }, 40);

    try {
      const data = await drawWinner();

      if (!data?.number) {
        clearInterval(interval);
        setDisplay("Error");
        setStep("IDLE");
        return;
      }

      const realNumber = data.number.toString();
      setWinner(data);

      // slowdown effect
      let slowdown = 0;

      const slowInterval = setInterval(() => {
        slowdown++;

        if (slowdown > 10) {
          clearInterval(interval);
          clearInterval(slowInterval);

          setStep("REVEAL");

          let current = "";
          let index = 0;

          const reveal = setInterval(() => {
            current += realNumber[index];
            index++;

            setDisplay(
              current +
                Math.floor(
                  Math.random() *
                    Math.pow(10, realNumber.length - current.length)
                )
                  .toString()
                  .padStart(realNumber.length - current.length, "0")
            );

            if (index === realNumber.length) {
              clearInterval(reveal);

              setTimeout(() => {
                setDisplay(realNumber);

                setHistory((h) => [
                  ...h,
                  { id: count + 1, number: realNumber },
                ]);

                setStep("CELEBRATION");
              }, 600);
            }
          }, 250);
        }
      }, 150);
    } catch (e) {
      clearInterval(interval);
      console.error(e);
      setStep("IDLE");
    }
  };

  const nextDraw = () => {
    setStep("IDLE");
    setWinner(null);
    setDisplay("------------");
    setCount((c) => c + 1);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* 🖼 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: "url('/logos/backgrounda.jpg')" }}
      />

      {/* 🌑 OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 🎬 CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* STAGE */}
        <div className="flex-1 flex flex-col items-center justify-center">

          {/* DRAW COUNTER */}
          <div className="mb-6 px-6 py-2 rounded-full bg-white text-cyan-700 font-bold shadow border border-cyan-300">
            Draw {count} / {maxWinners}
          </div>

          {count === maxWinners && (
            <span className="mb-4 px-4 py-1 bg-red-600 text-white rounded-full shadow">
              MAX WINNERS REACHED
            </span>
          )}

          {/* NUMBER DISPLAY */}
          <motion.div
            animate={{ scale: step === "SPINNING" ? 1.15 : 1 }}
            className="text-7xl font-extrabold tracking-widest mb-10 text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.9)]"
          >
            {display}
          </motion.div>

          {/* 🎯 CIRCULAR DRAW BUTTON */}
          <button
            onClick={startDraw}
            disabled={step !== "IDLE" || count >= maxWinners}
            className="
              w-40 h-40 rounded-full
              flex items-center justify-center
              text-xl font-bold text-cyan-500
              bg-gradient-to-br from-white via-white to-cyan-700
              text-black
              shadow-[0_0_25px_rgba(0,211,238,0.8)]
              border-4 border-black
              hover:scale-110 hover:shadow-[0_0_40px_rgba(0,211,238,1)]
              active:scale-95
              transition-all duration-300
              disabled:opacity-40
            "
          >
            Start Draw
          </button>

          {/* NEXT BUTTON */}
          {step === "CELEBRATION" && count < maxWinners - 1 && (
            <button
              onClick={nextDraw}
              className="mt-6 bg-cyan-700 text-black px-8 py-3 rounded-full font-bold"
            >
              ➡ NEXT DRAW
            </button>
          )}

          {/* HISTORY */}
          <div className="mt-10 w-[420px] space-y-2">

            <div className="bg-white text-yellow-700 text-center font-bold p-3 rounded-t-xl shadow">
              🎟 Winners
            </div>

            <div className="bg-blue-900/80 backdrop-blur-md p-3 rounded-b-xl space-y-2 max-h-72 overflow-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="bg-white text-cyan-800 px-4 py-2 rounded-lg flex justify-between items-center shadow border-l-4 border-cyan-500"
                >
                  <span className="font-semibold">#{h.id}</span>
                  <span className="font-mono tracking-wider">
                    {h.number}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* 🎉 CELEBRATION */}
      <AnimatePresence>
        {step === "CELEBRATION" && winner && (
          <Celebration winner={winner} onNext={nextDraw} />
        )}
      </AnimatePresence>
    </div>
  );
}