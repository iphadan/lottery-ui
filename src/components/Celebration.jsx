import { motion } from "framer-motion";

export default function Celebration({ winner, onNext }) {
  if (!winner) return null;

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

      {/* 🎆 REALISTIC FIREWORKS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* 🚀 Rockets */}
        {[...Array(10)].map((_, i) => (
          <span
            key={`rocket-${i}`}
            className="absolute text-xl"
            style={{
              bottom: "0%",
              left: `${Math.random() * 100}%`,
              animation: `launch ${2 + Math.random()}s linear infinite`,
            }}
          >
            🎇
          </span>
        ))}

        {/* 💥 Explosion */}
        {[...Array(15)].map((_, i) => (
          <span
            key={`explode-${i}`}
            className="absolute text-3xl"
            style={{
              top: `${20 + Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animation: `explode ${1 + Math.random()}s ease-out infinite`,
            }}
          >
            🎆
          </span>
        ))}

      </div>

      {/* 🏆 CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">

        <div className="space-y-6 w-full max-w-2xl">

          {/* FIELD ROW */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-lg font-semibold text-black bg-white px-3 py-2 rounded-lg">
              🎱 Number
            </label>
            <input
              value={winner.number}
              readOnly
              className="flex-1 p-3 rounded-lg bg-white text-black font-mono text-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 text-lg font-semibold text-black bg-white px-3 py-2 rounded-lg">
              🎱 Name
            </label>
            <input
              value={winner.customerName}
              readOnly
              className="flex-1 p-3 rounded-lg bg-white text-black"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 text-lg font-semibold text-black bg-white px-3 py-2 rounded-lg">
              🎱 Branch
            </label>
            <input
              value={winner.customerBranch}
              readOnly
              className="flex-1 p-3 rounded-lg bg-white text-black"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-40 text-lg font-semibold text-black bg-white px-3 py-2 rounded-lg">
              🎱 Location
            </label>
            <input
              value={winner.branchLocation}
              readOnly
              className="flex-1 p-3 rounded-lg bg-white text-black"
            />
          </div>

        </div>

        {/* NEXT BUTTON */}
        <div className="absolute bottom-10">
          <button
            onClick={onNext}
            className="
              bg-gradient-to-r from-green-400 to-cyan-500
              text-black
              px-12 py-4
              rounded-full
              font-bold
              text-xl
              shadow-lg
              hover:scale-110
              transition
            "
          >
            ➡ NEXT DRAW
          </button>
        </div>
      </div>

      {/* 🎬 CUSTOM ANIMATIONS */}
      <style>
        {`
          @keyframes launch {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateY(-80vh);
              opacity: 0;
            }
          }

          @keyframes explode {
            0% {
              transform: scale(0.3);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </motion.div>
  );
}