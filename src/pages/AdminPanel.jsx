import { useEffect, useState } from "react";
import {
  uploadCsv,
  getActiveSession,
  closeSession,
  getResults,
  loadSessionPool,
  getAllSessions,
} from "../api/lotteryApi";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [maxWinners, setMaxWinners] = useState(5);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [winners, setWinners] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  const [selectedWinners, setSelectedWinners] = useState([]);

  const [pool, setPool] = useState([]);
  const [showPool, setShowPool] = useState(false);

  useEffect(() => {
    loadSession();
    loadAllSessions();
  }, []);

  // 🔄 ACTIVE SESSION
  const loadSession = async () => {
    try {
      const data = await getActiveSession();
      setSession(data);

      if (data?.id) {
        loadWinners(data.id);
      }
    } catch {
      setSession(null);
    }
  };

  // 🔄 ALL SESSIONS
  const loadAllSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data || []);
    } catch {
      console.error("Failed to load sessions");
    }
  };

  // 🏆 ACTIVE WINNERS
  const loadWinners = async (sessionId) => {
    try {
      const data = await getResults(sessionId);
      setWinners(data || []);
    } catch {
      console.error("Failed to load winners");
    }
  };

  // 📂 SELECT SESSION
  const handleSelectSession = async (id) => {
    setSelectedSessionId(id);

    try {
      const data = await getResults(id);
      setSelectedWinners(data || []);
    } catch {
      setSelectedWinners([]);
    }

    setShowPool(false);
    setPool([]);
  };

  // 📊 LOAD POOL
  const loadPool = async () => {
    try {
      const data = await loadSessionPool(selectedSessionId);
      setPool(data || []);
      setShowPool(true);
    } catch {
      console.error("Failed to load pool");
    }
  };

  // 📤 UPLOAD
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
      loadAllSessions();
    } catch {
      setMessage({ type: "error", text: "Upload failed ❌" });
    } finally {
      setLoading(false);
    }
  };

  // ❌ CLOSE SESSION
  const handleClose = async () => {
    await closeSession();
    setSession(null);
    setWinners([]);
    setMessage({ type: "success", text: "Session closed" });
  };

  const displayWinners = selectedSessionId ? selectedWinners : winners;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-cyan-500">
        <img src="/logos/visa.png" className="h-10" />
        <div className="flex gap-4">
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

        {/* 📤 UPLOAD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">Upload CSV</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            type="number"
            value={maxWinners}
            onChange={(e) =>
              setMaxWinners(Number(e.target.value))
            }
            className="w-full mt-3 p-2 text-black rounded"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full bg-cyan-500 text-black py-2 rounded font-bold"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* 📊 ACTIVE SESSION */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">
            Active Session
          </h2>

          {session ? (
            <>
              <p>ID: {session.id}</p>
              <p>Max Winners: {session.maxWinners}</p>
              <p>
                Remaining:{" "}
                {session.maxWinners -
                  (session.drawnCount || 0)}
              </p>

              <button
                onClick={handleClose}
                className="mt-4 bg-red-500 w-full py-2 rounded"
              >
                Close Session
              </button>
            </>
          ) : (
            <p className="text-gray-400">
              No active session
            </p>
          )}
        </div>

        {/* 🏆 WINNERS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">
            Winners{" "}
            {selectedSessionId
              ? `(Session #${selectedSessionId})`
              : "(Active)"}
          </h2>

          {displayWinners.length === 0 ? (
            <p className="text-gray-400">
              No winners yet
            </p>
          ) : (
            displayWinners.map((w) => (
              <div
                key={w.id}
                className={`flex justify-between p-2 rounded mb-1 border ${
                  w.lotteryNumber.isUsed
                    ? "bg-yellow-400 text-black border-yellow-500"
                    : "bg-black border-cyan-800"
                }`}
              >
                <span className="font-bold">
                  {w.lotteryNumber.number}
                </span>

                <span>
                  {w.lotteryNumber.customerName}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 📂 SESSION SELECTOR */}
      <div className="px-8 pb-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">

          <h2 className="text-cyan-400 mb-4">
            Session Explorer
          </h2>

          <select
            onChange={(e) =>
              handleSelectSession(
                Number(e.target.value)
              )
            }
            className="w-full p-2 text-black"
          >
            <option>Select Session</option>

            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                Session #{s.id}
              </option>
            ))}
          </select>

          {selectedSessionId && (
            <button
              onClick={loadPool}
              className="mt-4 bg-cyan-500 text-black px-4 py-2 rounded"
            >
              Show Pool
            </button>
          )}
        </div>
      </div>

      {/* 📊 POOL MODAL */}
      {showPool && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-gray-900 w-[85%] h-[85%] rounded-xl border border-cyan-500 flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b border-cyan-700">
              <h2 className="text-cyan-400 font-bold">
                Lottery Pool (Session #{selectedSessionId})
              </h2>

              <button
                onClick={() => setShowPool(false)}
                className="text-red-400 text-xl"
              >
                ✖
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-auto p-4">

              {pool.length === 0 ? (
                <p className="text-gray-400">
                  No pool data
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  {pool.map((p) => (
                    <div
                      key={p.id}
                      className={`p-2 rounded flex justify-between border ${
                        p.isUsed
                          ? "bg-yellow-400 text-black border-yellow-500"
                          : "bg-black border-cyan-800"
                      }`}
                    >
                      <span className="font-bold">
                        {p.number}
                      </span>

                      <span className="text-sm">
                        {p.customerName}
                      </span>
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}