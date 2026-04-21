import { motion } from "framer-motion";

const floatingItems = [
  "/logos/usa-header-trans.png",
  "/logos/mexico-header.webp",
  "/logos/canada-header-trans.png",
  "/logos/cooperative.png",
  "/logos/visa.png",
  "/logos/worldcup.png",
  "/logos/infinity.jpg",
  "/logos/worldcup-sider.jpg",
];

const emojis = ["🎉", "🏆", "🎊", "✨", "🔥", "⚽", "💳"];

export default function Celebration({ winner, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/90 overflow-hidden flex flex-col items-center">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-yellow-500/10 to-green-500/10 animate-pulse" />

      {/* 🏆 WINNER (UPPER CENTER) */}
      <div className="text-center relative z-10 mt-20 px-4">

        <h1 className="text-4xl text-orange-400 font-bold mb-4">
          🎉🏆 WINNER SELECTED 🏆🎉
        </h1>

        <div className="text-7xl md:text-8xl font-extrabold text-cyan-400 tracking-widest">
          {winner.number}
        </div>

        <div className="text-3xl text-orange-400 font-bold mt-4">
          {winner.customerName}
        </div>

        <div className="text-xl text-orange-400 mt-4">
          {winner.customerBranch}
        </div>

        <div className="text-xl text-orange-400 mt-4">
          {winner.branchLocation}
        </div>

        <p className="text-gray-400 mt-4">
          ⚽ World Cup Experience Package ⚽
        </p>
      </div>

      {/* 🎉 EMOJI CELEBRATION */}
      {Array.from({ length: 20 }).map((_, i) => {
        const emoji = emojis[i % emojis.length];

        return (
          <motion.div
            key={`emoji-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${(i / 20) * 100}%`,
              top: "-5%",
            }}
            animate={{
              y: ["0%", "120vh"],
              x: ["0%", `${(Math.random() - 0.5) * 200}px`],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* 🌍 LEFT FLOW */}
      {floatingItems.map((src, i) => (
        <motion.img
          key={`left-${i}`}
          src={src}
          className="absolute w-16 opacity-80"
          style={{ left: "-10%", top: "5%" }}
          animate={{
            x: ["0%", "110vw"],
            y: ["0%", "120vh"],
            rotate: 360,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      {/* 🌍 CENTER FLOAT */}
      {floatingItems.map((src, i) => (
        <motion.img
          key={`center-${i}`}
          src={src}
          className="absolute w-14 opacity-70"
          style={{
            left: "50%",
            top: "5%",
            transform: "translateX(-50%)",
          }}
          animate={{
            y: ["0%", "120vh"],
            x: ["0%", `${(Math.random() - 0.5) * 250}px`],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        />
      ))}

      {/* 🌍 RIGHT FLOW */}
      {floatingItems.map((src, i) => (
        <motion.img
          key={`right-${i}`}
          src={src}
          className="absolute w-16 opacity-80"
          style={{ left: "110%", top: "5%" }}
          animate={{
            x: ["0%", "-110vw"],
            y: ["0%", "120vh"],
            rotate: 360,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}

      {/* 🔻 BOTTOM AREA (NO OVERLAP) */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4 z-30">

        {/* ⚽ WORLD CUP */}
        <motion.img
          src="/logos/worldcup.png"
          className="w-44 "
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />

        {/* NEXT BUTTON */}
        <button
          onClick={onNext}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-full font-bold shadow-lg"
        >
          ➡ Next Draw
        </button>

      </div>
    </div>
  );
}