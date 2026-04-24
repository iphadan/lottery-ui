import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Celebration({ winner, onNext }) {
  const audioRef = useRef(null);

  if (!winner) return null;

  // 🔊 START CELEBRATION SOUND
  useEffect(() => {
    const audio = new Audio("/sounds/celebration.mp3");
    audio.loop = true;
    audio.volume = 0.6;

    audio.play().catch(() => {});
    audioRef.current = audio;

    return () => {
      // 🛑 STOP SOUND WHEN COMPONENT UNMOUNTS
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleNext = () => {
    // 🛑 STOP SOUND BEFORE NEXT DRAW
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden text-white"
    >
      {/* 🖼 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: "url('/logos/backgroundb.jpg')" }}
      />

      {/* 🎆 FIREWORKS (ROCKET + EXPLOSION) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl"
            style={{
              bottom: "0%",
              left: `${Math.random() * 100}%`,
              animation: `launch ${2 + Math.random()}s linear infinite`,
            }}
          >
            🎇
          </span>
        ))}

        {[...Array(15)].map((_, i) => (
          <span
            key={`boom-${i}`}
            className="absolute text-3xl"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animation: `explode ${1 + Math.random()}s ease-out infinite`,
            }}
          >
            🎆
          </span>
        ))}
      </div>

      {/* 🚀 LOGOS LAUNCHING FROM BOTTOM */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          "/logos/cooperative.png",
          "/logos/canada-header-trans.png",
          "/logos/visa.webp",
          "/logos/infinity.png",
          "/logos/worldcup-trans.png",
          "/logos/usa-header-trans.png",
          "/logos/mexico-header.webp",
        ].map((src, i) => (
          <img
            key={i}
            src={src}
            className="absolute h-12"
            style={{
              bottom: "0%",
              left: `${Math.random() * 100}%`,
              animation: `launch ${3 + Math.random()}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* 🏆 CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">

        <div className="space-y-6 w-full max-w-3xl">

          {/* NUMBER */}
          <div className="flex items-center gap-4">
            <label className="w-44 text-lg font-bold text-black bg-white px-3 py-3 rounded-lg">
              🎱 Number
            </label>
            <input
              value={winner.number}
              readOnly
              className="flex-1 p-4 w-44 rounded-lg bg-white text-black font text-3xl font-extrabold tracking-widest"
            />
          </div>

          {/* NAME */}
          <div className="flex items-center gap-4">
            <label className="w-44 text-lg font-bold text-black bg-white px-3 py-3 rounded-lg">
              🎱 Name
            </label>
            <input
              value={winner.customerName}
              readOnly
              className="flex-1 p-4 w-44 rounded-lg bg-white text-black text-lg font-semibold"
            />
          </div>

          {/* BRANCH */}
          <div className="flex items-center gap-4">
            <label className="w-44 text-lg font-bold text-black bg-white px-3 py-3 rounded-lg">
              🎱 Branch
            </label>
            <input
              value={winner.customerBranch}
              readOnly
              className="flex-1  p-4 rounded-lg bg-white text-black text-lg"
            />
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-4">
            <label className="w-44 text-lg font-bold text-black bg-white px-3 py-3 rounded-lg">
              🎱 Location
            </label>
            <input
              value={winner.branchLocation}
              readOnly
              className="flex-1 p-4 rounded-lg bg-white text-black text-lg"
            />
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="absolute bottom-10">
          <button
            onClick={handleNext}
            className="
              bg-gradient-to-r from-green-400 to-cyan-500
              text-black
              px-12 py-4
              rounded-full
              font-bold
              text-xl
              shadow-[0_0_25px_rgba(34,211,238,0.8)]
              hover:scale-110
              transition
            "
          >
            ➡ NEXT DRAW
          </button>
        </div>
      </div>

      {/* 🎬 ANIMATIONS */}
      <style>
        {`
          @keyframes launch {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-100vh); opacity: 0; }
          }

          @keyframes explode {
            0% { transform: scale(0.3); opacity: 1; }
            100% { transform: scale(1.8); opacity: 0; }
          }
        `}
      </style>
    </motion.div>
  );
}