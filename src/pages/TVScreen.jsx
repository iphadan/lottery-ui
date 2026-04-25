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

  // 🔄 LOAD SESSION
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

  // ⚠️ WAIT UNTIL SESSION EXISTS
  const maxWinners = session?.maxWinners || 0;

  // 🎹 KEYBOARD CONTROL (SPACE + ENTER)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // SPACE → START DRAW
      if (e.code === "Space") {
        e.preventDefault();

        if (step === "IDLE" && count < maxWinners) {
          startDraw();
        }
      }

      // ENTER → NEXT DRAW
      if (e.code === "Enter") {
        if (step === "CELEBRATION") {
          nextDraw();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, count, maxWinners]); // ✅ SAFE DEPENDENCIES

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        ⚠ No Active Session
      </div>
    );
  }

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
        setDisplay(
          data?.message === "No active session"
            ? "No Active Session"
            : "Error"
        );
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

                stopSpinSound();
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
        className="absolute inset-0 bg-contain bg-center bg-no-repeat bg-black"
        style={{ backgroundImage: "url('/logos/backgrounda.jpg')" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        <div className="flex-1 flex flex-col items-center justify-center">

          {/* DRAW COUNTER */}
          <div className="mb-6 px-8 py-3 rounded-full bg-white text-cyan-700 font-bold shadow-lg text-lg">
            Draw {count} / {maxWinners}
          </div>

          {maxWinners === count && (
            <div className="mt-1 px-8 py-3 text-red-500 font-bold text-3xl">
              Max Draw Reached
            </div>
          )}

          {/* NUMBER */}
          <motion.div
            animate={{ scale: step === "SPINNING" ? 1.15 : 1 }}
            className="text-8xl font-extrabold tracking-widest mb-12 text-cyan-100 drop-shadow-[0_0_40px_rgba(34,211,238,0.9)]"
          >
            {display}
          </motion.div>

          {/* BUTTON */}
          <motion.button
            onClick={startDraw}
            disabled={step !== "IDLE" || count >= maxWinners}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className="relative w-66 h-56 rounded-full overflow-hidden disabled:opacity-40"
          >
            <img
              src="/logos/start-btn.webp"
              alt="Start Draw"
              className="w-full h-full object-contain pointer-events-none"
            />

            <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.6)]" />
          </motion.button>

          {/* HISTORY */}
          <div className="mt-6 w-[550px]">

            {/* SLOGAN */}
            <div className="absolute left-14 top-[55%] -translate-y-1/2 hidden lg:block">
              <div className="text-orange-500 text-2xl font-extrabold">
                Bank Smarter, Live Better!
              </div>
            </div>

            <div className="bg-white text-cyan-600 text-center font-bold p-4 rounded-t-xl shadow-lg text-lg">
              🏆 WINNERS
            </div>

            <div className="bg-cyan-900/80 p-2 rounded-b-xl text-lg font-bold space-y-2 max-h-80 overflow-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="bg-white text-cyan-600 px-4 py-3 rounded-lg flex justify-between border-l-8 border-cyan-400"
                >
                  <span className="font-bold">#{h.id}</span>
                  <span className="font-mono tracking-widest text-2xl">
                    {h.number}
                  </span>
                </div>
              ))}
            </div>
          </div>

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