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

    let speed = 40;

    let interval = setInterval(() => {
      setDisplay(
        Math.floor(100000000000 + Math.random() * 900000000000).toString()
      );
    }, speed);

    try {
      const data = await drawWinner();
      if (!data?.number) {
if (data?.status === 202) {
setDisplay("No Active Session Found");}
else{
    setDisplay("Error Occurred");
}



        clearInterval(interval);
        setStep("IDLE");
        return;


      }
      const realNumber = data.number.toString();

      setWinner(data);

      // ⏳ SLOW DOWN EFFECT
      let slowdown = 0;

      const slowInterval = setInterval(() => {
        slowdown += 1;

        if (slowdown > 10) {
          clearInterval(interval);
          clearInterval(slowInterval);

          // 🎬 REVEAL DIGITS ONE BY ONE
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
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-black border-b border-cyan-500 shadow-lg">
<link rel="icon" href="/favicon.ico" />
        <img src="/logos/visa.png" className="h-10" />

        <div className="flex gap-4">
          <img src="/logos/usa-header.png" className="h-10" />
          <img src="/logos/mexico-header.webp" className="h-10" />
          <img src="/logos/canada-header.webp" className="h-10" />
        </div>

        <img src="/logos/cooperative.png" className="h-10" />
      </div>

      {/* STAGE */}
      <div className="flex-1 flex flex-col items-center justify-center">

        <div className="text-cyan-400 mb-4">
          Draw {count } / {maxWinners}


        </div>
       {count === maxWinners &&
  <span className="text-red-500 ml-4">MAX WINNERS REACHED</span>
}
        {/* NUMBER */}
        <motion.div
          animate={{ scale: step === "SPINNING" ? 1.15 : 1 }}
          className="text-7xl font-bold tracking-widest mb-10 text-cyan-400"
        >
          {display}
        </motion.div>

        {/* BUTTON */}
        <button
          onClick={startDraw}
          disabled={step !== "IDLE" || count >= maxWinners}
          className="bg-green-500 text-black px-10 py-4 rounded-full text-2xl font-bold disabled:opacity-40 hover:scale-105 transition"
        >
          🎯 START DRAW
        </button>

        {/* NEXT */}
        {step === "CELEBRATION" && count < maxWinners - 1 && (
          <button
            onClick={nextDraw}
            className="mt-6 bg-cyan-500 text-black px-8 py-3 rounded-full font-bold"
          >
            ➡ NEXT DRAW
          </button>
        )}

        {/* HISTORY */}
        <div className="mt-10 w-96 space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="bg-gray-900 border border-cyan-700 p-2 flex justify-between"
            >
              <span>#{h.id}</span>
              <span className="text-green-400">{h.number}</span>
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