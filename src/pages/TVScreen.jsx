import { useState, useEffect, useRef } from "react";
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

  const spinAudioRef = useRef(null);

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
      } catch {
        console.error("Init failed");
      }
    };

    load();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        ⚠ No Active Session
      </div>
    );
  }

  const maxWinners = session.maxWinners;

  // 🔊 SOUND CONTROL
  const startSpinSound = () => {
    const audio = new Audio("/sounds/spin.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {});
    spinAudioRef.current = audio;
  };

  const stopSpinSound = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.pause();
      spinAudioRef.current.currentTime = 0;
    }
  };

  // 🎯 DRAW
  const startDraw = async () => {
    if (step !== "IDLE" || count >= maxWinners) return;

    setStep("SPINNING");
    startSpinSound();

    let interval = setInterval(() => {
      setDisplay(
        Math.floor(100000000000 + Math.random() * 900000000000).toString()
      );
    }, 40);

    try {
      const data = await drawWinner();

      if (!data?.number) {
        if(data?.message === "No active session"){

          setDisplay("No Active Session");
        }
        else{
        setDisplay("Error");


        }
        clearInterval(interval);
        stopSpinSound();
        setStep("IDLE");
        return;
      }

      const realNumber = data.number.toString();
      setWinner(data);

      let slowdown = 0;

      const slowInterval = setInterval(() => {
        slowdown++;

        if (slowdown > 12) {
          clearInterval(interval);
          clearInterval(slowInterval);

          setStep("REVEAL");

          let current = "";
          let index = 0;

          const reveal = setInterval(() => {
            current += realNumber[index];
            index++;

            // ✅ FIXED: no fake zeros
            const remaining = Array.from(
              { length: realNumber.length - current.length },
              () => Math.floor(Math.random() * 10)
            ).join("");

            setDisplay(current + remaining);

            if (index === realNumber.length) {
              clearInterval(reveal);

              setTimeout(() => {
                setDisplay(realNumber);

                setHistory((h) => [
                  ...h,
                  { id: count + 1, number: realNumber },
                ]);

                stopSpinSound(); // ✅ STOP ONLY HERE
                setStep("CELEBRATION");
              }, 800);
            }
          }, 280);
        }
      }, 140);
    } catch (e) {
      clearInterval(interval);
      stopSpinSound();
      console.error(e);
      setStep("IDLE");
    }
  };

  const nextDraw = () => {
    stopSpinSound();
    setStep("IDLE");
    setWinner(null);
    setDisplay("------------");
    setCount((c) => c + 1);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: "url('/logos/backgrounda.jpg')" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        <div className="flex-1 flex flex-col items-center justify-center">

          {/* DRAW COUNTER */}
          <div className="mb-6 px-8 py-3 rounded-full bg-white text-cyan-700 font-bold shadow-lg text-lg">
            Draw {count} / {maxWinners}
          </div>

          {/* NUMBER */}
          <motion.div
            animate={{ scale: step === "SPINNING" ? 1.15 : 1 }}
            className="text-8xl font-extrabold tracking-widest mb-12 text-cyan-100 drop-shadow-[0_0_40px_rgba(34,211,238,0.9)]"
          >
            {display}
          </motion.div>

          {/* GOLD BUTTON */}
          <motion.button
            onClick={startDraw}
            disabled={step !== "IDLE" || count >= maxWinners}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="
              w-52 h-52 rounded-full flex flex-col items-center justify-center
              bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600
              border-[8px] border-yellow-100
              shadow-[0_20px_60px_rgba(0,0,0,0.8),
                      inset_0_10px_30px_rgba(255,255,255,0.9),
                      inset_0_-10px_30px_rgba(180,120,0,0.7)]
              text-black font-bold text-2xl
              overflow-hidden disabled:opacity-40
            "
          >
            <span>START</span>
            <span className="text-sm opacity-80">DRAW</span>
          </motion.button>

          {/* HISTORY */}
          <div className="mt-12 w-[450px]">
            <div className="bg-white text-cyan-600 text-center font-bold p-4 rounded-t-xl shadow-lg text-lg">
              🏆 WINNERS
            </div>

            <div className="bg-blue-900/80 p-4 rounded-b-xl space-y-2 max-h-80 overflow-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="bg-white text-cyan-800 px-4 py-3 rounded-lg flex justify-between shadow border-l-4 border-cyan-500"
                >
                  <span className="font-bold">#{h.id}</span>
                  <span className="font-mono tracking-widest text-lg">
                    {h.number}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {step === "CELEBRATION" && winner && (
          <Celebration winner={winner} onNext={nextDraw} />
        )}
      </AnimatePresence>
    </div>
  );
}