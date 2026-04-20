// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Celebration from "./components/Celebration";
// import { drawWinner } from "./api/lotteryApi";


// function getRandomNumber() {
//   return Math.floor(10000 + Math.random() * 90000);
// }

// export default function App() {
//   const spinSound = new Audio("/sounds/spin.mp3");
// const drumSound = new Audio("/sounds/drumroll.mp3");
// const impactSound = new Audio("/sounds/impact.mp3");
// const celebrationSound = new Audio("/sounds/celebration.mp3");

// // loop celebration
// celebrationSound.loop = false;
//   const MAX = 5;
// const [step, setStep] = useState("IDLE");
// const [winner, setWinner] = useState(null);
//   const [display, setDisplay] = useState("-----");
//   const [history, setHistory] = useState([]);
// const [count, setCount] = useState(0);

// const startDraw = async () => {
//   if (step !== "IDLE") return;

//   setStep("SPINNING");

//   let interval = setInterval(() => {
//     setDisplay(Math.floor(10000 + Math.random() * 90000)); // visual only
//   }, 60);

//   setTimeout(async () => {
//     clearInterval(interval);

//     const data = await drawWinner(); // 🔥 REAL BACKEND CALL

//     setDisplay(data.number);
//     setWinner(data);

//     setHistory((h) => [
//       ...h,
//       { id: count + 1, number: data.number },
//     ]);

//     setStep("CELEBRATION");
//   }, 2500);
// };
// const nextDraw = () => {
//   if (step !== "CELEBRATION") return;

//   celebrationSound.pause();
//   celebrationSound.currentTime = 0;
//   celebrationSound.volume=0;
//   celebrationSound.loop=false;
//   console.log("Celebration sound stopped and reset.");

//   setStep("IDLE");
//   setWinner(null);
//   setDisplay("-----");
//   setCount((c) => c + 1);
// };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col overflow-hidden">

//       {/* HEADER */}
//       {/* 🌍 HEADER SPONSOR BAR */}
// {/* 🌍 HEADER */}
// <div className="flex items-center justify-between px-6 py-3 bg-gray-950 border-b border-yellow-500">

//   {/* 💳 LEFT — VISA */}
//   <div className="flex items-center">
//     <img
//       src="/logos/visa.png"
//       className="h-10 object-contain"
//       alt="Visa"
//     />
//   </div>

//   {/* 🌍 CENTER — FLAGS */}
//   <div className="flex items-center gap-4">
//     <img src="/logos/usa-header.png" className="h-10" />
//     <img src="/logos/mexico-header.webp" className="h-10" />
//     <img src="/logos/canada-header.webp" className="h-10" />
//   </div>

//   {/* 🏦 RIGHT — COOP */}
//   <div className="flex items-center">
//     <img
//       src="/logos/cooperative.png"
//       className="h-10 object-contain"
//       alt="Cooperative Bank"
//     />
//   </div>

// </div>

//       {/* STAGE */}
//       <div className="flex-1 flex flex-col items-center justify-center">

//         <div className="text-xl mb-4">
//           Draw {count} / {MAX}
//         </div>

//         {/* NUMBER */}
//         <motion.div
//           animate={{ scale: step === "SPINNING" ? 1.2 : 1 }}
//           className="text-7xl font-bold text-yellow-300 mb-10"
//         >
//           {display}
//         </motion.div>

//         {/* MAIN BUTTON */}
//         <button
//           onClick={startDraw}
//           disabled={step !== "IDLE" || count >= MAX}
//           className="bg-yellow-500 text-black px-10 py-4 rounded-full text-2xl font-bold disabled:opacity-40"
//         >
//           {step === "SPINNING" ? "🎲 Drawing..." : "🎯 START DRAW"}
//         </button>

//         {/* NEXT BUTTON (ONLY AFTER LOCK) */}
//         {step === "LOCKED" && count < MAX && (
//           <button
//             onClick={nextDraw}
//             className="mt-4 bg-green-500 text-black px-8 py-3 rounded-full font-bold"
//           >
//             ➡ Next Draw
//           </button>
//         )}

//         {/* HISTORY */}
//         <div className="mt-10 space-y-2 w-80">
//           {history.map((h) => (
//             <div key={h.id} className="bg-gray-900 p-2 flex justify-between">
//               <span>Draw #{h.id}</span>
//               <span className="text-yellow-300">{h.number}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CELEBRATION */}
//       <AnimatePresence>
//         {step === "CELEBRATION" && winner && (
// <Celebration winner={winner} onNext={nextDraw} />        )}
//       </AnimatePresence>
//     </div>
//   );

// }


import { Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import TVScreen from "./pages/TVScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TVScreen />} />
      <Route path="/tv" element={<TVScreen />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}