import { useEffect, useState } from "react";
import {
  uploadCsv,
  getActiveSession,
  closeSession,
  getResults,
} from "../api/lotteryApi";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [maxWinners, setMaxWinners] = useState(5);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const data = await getActiveSession();
    setSession(data);

    if (data?.id) {
      loadWinners(data.id);
    }
  };
const loadWinners = async (sessionId) => {
  try {
    const data = await getResults(sessionId);


    setWinners(data || []);
  } catch (e) {
    console.error("Failed to load winners", e);
  }
};

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select CSV file" });
      return;
    }

    setLoading(true);
    try {
      const data = await uploadCsv(file, maxWinners);
      setSession(data);
      setMessage({ type: "success", text: "Upload successful ✅" });
    } catch (e) {
      setMessage({ type: "error", text: "Upload failed ❌" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    await closeSession();
    setSession(null);
    setWinners([]);
    setMessage({ type: "success", text: "Session closed" });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* 🔵 HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-cyan-500">

        <img src="/logos/visa.png" className="h-10" />

        <div className="flex items-center gap-4">
          <img src="/logos/usa-header.png" className="h-10" />
          <img src="/logos/mexico-header.webp" className="h-10" />
          <img src="/logos/canada-header.webp" className="h-10" />
        </div>

        <img src="/logos/cooperative.png" className="h-10" />
      </div>

      {/* MESSAGE */}
      {message && (
        <div
          className={`p-3 text-center ${
            message.type === "error"
              ? "bg-red-500"
              : "bg-cyan-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-8 grid grid-cols-3 gap-6">

        {/* 📤 UPLOAD PANEL */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-lg font-bold mb-4 text-cyan-400">
            Upload Lottery CSV
          </h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <label className="block mb-2 text-sm">Max Winners</label>
          <input
            type="number"
            value={maxWinners}
            onChange={(e) => setMaxWinners(Number(e.target.value))}
            className="w-full p-2 text-black rounded"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full bg-cyan-500 text-black py-2 rounded font-bold"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* 📊 SESSION INFO */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-lg font-bold mb-4 text-cyan-400">
            Active Session
          </h2>

          {session ? (
            <div className="space-y-2 text-sm">
              <p>ID: {session.id}</p>
              <p>Status: {session.status}</p>
              <p>Max Winners: {session.maxWinners}</p>
              <p>
                Remaining:{" "}
                {session.maxWinners - (session.drawnCount || 0)}
              </p>

              <button
                onClick={handleClose}
                className="mt-4 bg-red-500 px-4 py-2 rounded w-full"
              >
                Close Session
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No active session</p>
          )}
        </div>

        {/* 🏆 WINNERS PANEL */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-lg font-bold mb-4 text-cyan-400">
            Winners (Live)
          </h2>

          {winners.length === 0 ? (
            <p className="text-gray-400">No winners yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-auto">
           {winners.map((w) => (
  <div
    key={w.id}
    className="bg-black p-2 rounded flex justify-between border border-cyan-800"
  >
    <span>{w.lotteryNumber.number}</span>
    <span className="text-cyan-400">
      {w.lotteryNumber.customerName}
    </span>
  </div>
))}
            </div>
          )}
        </div>
      </div>

      {/* 📊 DRAW POOL */}
      {session && (
        <div className="px-8 pb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
            <h2 className="text-lg font-bold mb-4 text-cyan-400">
              Draw Pool Summary
            </h2>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <p>File: {session.fileName}</p>
              <p>Total: {session.totalRecords}</p>
              <p>Unique: {session.uniqueNumbers}</p>
              <p>Duplicates: {session.duplicateCount}</p>
              <p>Drawn: {session.drawnCount}</p>
              <p>
                Remaining: {session.maxWinners - session.drawnCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}