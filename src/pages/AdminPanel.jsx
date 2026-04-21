import { useEffect, useState } from "react";
import {
  uploadCsv,
  getActiveSession,
  closeSession,
  getResults,
  loadSessionPool,
} from "../api/lotteryApi";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [maxWinners, setMaxWinners] = useState(5);

  const [session, setSession] = useState(null);
  const [winners, setWinners] = useState([]);
  const [pool, setPool] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPool, setShowPool] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  // 🔄 LOAD EVERYTHING
  const loadAll = async () => {
    try {
      const sessionData = await getActiveSession();
if (!sessionData || !sessionData.id) {
  setSession(null);
  setWinners([]);
  setPool([]);
  return;}
      setSession(sessionData);

      if (sessionData?.id) {
        const winnersData = await getResults(sessionData.id);
        setWinners(Array.isArray(winnersData) ? winnersData : []);

        const poolData = await loadSessionPool(sessionData.id);
        setPool(Array.isArray(poolData) ? poolData : []);
      }

    } catch (e) {
      console.error("Load failed", e);
      setSession(null);
      setWinners([]);
      setPool([]);
    }
  };

  // 📤 UPLOAD CSV
  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select CSV file" });
      return;
    }

    setLoading(true);
    try {
      const data = await uploadCsv(file, maxWinners);

      setMessage({
        type: "success",
        text: `${data.totalRecords} Records Uploaded ✅`,
      });

      await loadAll(); // 🔥 refresh everything

    } catch {
      setMessage({ type: "error", text: "Upload failed ❌" });
    } finally {
      setLoading(false);
    }
  };

  // ❌ CLOSE SESSION
  const handleClose = async () => {
    try {
      await closeSession();

      setSession(null);
      setWinners([]);
      setPool([]);

      setMessage({
        type: "success",
        text: "Session closed",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to close session",
      });
    }
  };

  const totalPool = session?.totalRecords || 0;
  const drawn = session?.drawnCount || 0;
  const remainingPool = totalPool - drawn;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-black border-b border-cyan-500">
        <img src="/logos/cooperative.png" className="h-10" />

        <div className="flex gap-4">
          <img src="/logos/usa-header-trans.png" className="h-12" />
          <img src="/logos/mexico-header.webp" className="h-12" />
          <img src="/logos/canada-header-trans.png" className="h-12" />
        </div>

        <img src="/logos/visa.webp" className="h-12" />
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={`p-3 text-center ${message.type === "error" ? "bg-red-500" : "bg-cyan-600"}`}>
          {message.text}
        </div>
      )}

      <div className="p-8 grid grid-cols-3 gap-6">

        {/* UPLOAD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">Upload CSV</h2>

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <input
            type="number"
            value={maxWinners}
            onChange={(e) => setMaxWinners(Number(e.target.value))}
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

        {/* SESSION INFO */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">
            Active Session
          </h2>

          {session ? (
            <>
            
              <div className="flex justify-between p-2 rounded border-cyan-500">Total Pool: <span></span> {pool.length}</div>
              <div className="flex justify-between p-2 rounded border-cyan-500">Drawn: <span>{session.drawnCount}</span></div>
              <div className="flex justify-between p-2 rounded border-cyan-500">Remaining Pool: <span>{pool.length - session.drawnCount}</span> </div>
              <div className="flex justify-between p-2 rounded border-cyan-500">Max Winners: <span>{session.maxWinners}</span></div>
              <div className="flex justify-between p-2 rounded border-cyan-500">Created:  <span>{session.createdAt}</span> </div>

              <button
                onClick={handleClose}
                className="mt-4 bg-red-500 w-full py-2 rounded"
              >
                Close Session
              </button>
            </>
          ) : (
            <p className="text-gray-400">No active session</p>
          )}
        </div>

        {/* WINNERS */}
        <div className="bg-gray-900 p-6 rounded-xl border border-cyan-700">
          <h2 className="text-cyan-400 font-bold mb-4">
            Winners
          </h2>

          {winners.length === 0 ? (
            <p className="text-gray-400">No winners yet</p>
          ) : (
            winners.map((w) => (
              <div
                key={w.id}
                className={`flex justify-between p-2 rounded mb-1 border ${
                  w.lotteryNumber?.isUsed
                    ? "bg-yellow-400 text-black border-yellow-500"
                    : "bg-black border-cyan-800"
                }`}
              >
                <span className="font-bold">
                  {w.lotteryNumber?.number}
                </span>
                <span>{w.lotteryNumber?.customerName}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SHOW POOL BUTTON */}
      {session && (
        <div className="px-8 pb-8">
          <button
            onClick={() => setShowPool(true)}
            className="bg-cyan-500 text-black px-6 py-2 rounded"
          >
            Show Full Pool ({pool.length})
          </button>
        </div>
      )}

      {/* POOL MODAL */}
      {showPool && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-gray-900 w-[85%] h-[85%] rounded-xl border border-cyan-500 flex flex-col">

            <div className="flex justify-between items-center p-4 border-b border-cyan-700">
              <h2 className="text-cyan-400 font-bold">
                Lottery Pool ({pool.length})
              </h2>

              <button
                onClick={() => setShowPool(false)}
                className="text-red-400 text-xl"
              >
                ✖
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">

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
                    <span className="font-bold">{p.number}</span>
                    <span className="text-sm">{p.customerName}</span>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}