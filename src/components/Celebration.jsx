import { motion } from "framer-motion";

const floatingItems = [
  "/logos/usa-header.png",
  "/logos/mexico-header.webp",
  "/logos/canada-header.webp",
  "/logos/cooperative.png",
  "/logos/visa.png",
];

const colors = [
  "bg-cyan-400",
  "bg-blue-500",
  "bg-yellow-400",
  "bg-green-500",
  "bg-red-500",
  "bg-amber-300",
];
const emojis = ["🎉", "🏆", "🎊", "✨", "🔥", "⚽", "💳"];
export default function Celebration({ winner, onNext }) {
  return (
    <div className="fixed inset-0 bg-black/90 overflow-hidden flex items-center justify-center">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-yellow-500/10 to-red-500/10 animate-pulse" />

      {/* 🏆 CENTER */}
 {/* 🏆 CENTER WINNER */}
<div className="text-center z-20 relative">

  <h1 className="text-4xl text-green-400 font-bold mb-4">
    🎉🏆 WINNER SELECTED 🏆🎉
  </h1>



  <div className="text-8xl font-extrabold text-yellow-300 tracking-widest relative z-10">
    {winner.number}
  </div>

  <p className="text-gray-300 mt-4">
    ⚽ World Cup Experience Package ⚽
  </p>

</div>

      {/* 🍃 COLOR PARTICLES (FULL WIDTH FIXED) */}
    {/* 🍃 CENTER FLOW (SLOW - PREMIUM EFFECT) */}
{/* 🎉 EMOJI CELEBRATION LAYER */}
{/* 🎉 EMOJI CELEBRATION LAYER */}
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
        x: [
          "0%",
          `${(Math.random() - 0.5) * 200}px`,
        ],
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
      {/* 🍃 LOGOS + FLAGS (DISTRIBUTED EVENLY) */}
   {/* 🌍 LOGOS FROM LEFT */}
{floatingItems.map((src, i) => (
  <motion.img
    key={`logo-left-${i}`}
    src={src}
    className="absolute w-16 opacity-80"
    style={{
      left: "-10%",
      top: "5%",
    }}
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

{/* 🌍 CENTER LOGO FLOW (SLOW FLOAT) */}
{floatingItems.map((src, i) => (
  <motion.img
    key={`center-logo-${i}`}
    src={src}
    className="absolute w-14 opacity-70"
    style={{
      left: "50%",
      top: "5%",
      transform: "translateX(-50%)",
    }}
    animate={{
      y: ["0%", "120vh"],
      x: [
        "0%",
        `${(Math.random() - 0.5) * 250}px`,
      ],
      rotate: [0, 360],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 12 + Math.random() * 8, // slower than sides
      repeat: Infinity,
      delay: i * 0.6,
    }}
  />
))}

{/* 🌍 LOGOS FROM RIGHT */}
{floatingItems.map((src, i) => (
  <motion.img
    key={`logo-right-${i}`}
    src={src}
    className="absolute w-16 opacity-80"
    style={{
      left: "110%",
      top: "5%",
    }}
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
)



)}

      {/* ⚽ WORLD CUP */}
      <motion.img
        src="/logos/worldcup.png"
        className="absolute bottom-10 w-64"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />

      {/* NEXT BUTTON */}
      <button
        onClick={onNext}
        className="absolute bottom-10 bg-green-500 text-black px-8 py-3 rounded-full font-bold z-30"
      >
        ➡ Next Draw
      </button>

    </div>
  );
}