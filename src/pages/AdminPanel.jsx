import { useEffect, useState } from "react";
import {
  uploadCsv,
  getActiveSession,
  closeSession,
} from "../api/lotteryApi";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [maxWinners, setMaxWinners] = useState(5);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);
  // 🔄 load active session on page load
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const data = await getActiveSession();
    setSession(data);
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
    setMessage({ type: "success", text: "Session closed" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">

      <h1 className="text-2xl font-bold mb-6">
        🧑‍💼 Admin Panel
      </h1>

      {/* UPLOAD */}
      <div className="bg-gray-800 p-6 rounded mb-6">
        <h2 className="text-lg mb-4">Upload Lottery CSV</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <div className="mb-3">
          <label>Max Winners:</label>
          <input
            type="number"
            value={maxWinners}
            onChange={(e) => setMaxWinners(e.target.value)}
            className="ml-2 text-black px-2"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* SESSION INFO */}
      <div className="bg-gray-800 p-6 rounded">

        <h2 className="text-lg mb-4">Active Session</h2>

        {session ? (
          <>
            <p><strong>ID:</strong> {session.id}</p>
            <p><strong>Status:</strong> {session.status}</p>
            <p><strong>Message:</strong> {session.message}</p>
            <p><strong>Max Winners:</strong> {session.maxWinners}</p>

            <button
              onClick={handleClose}
              className="mt-4 bg-red-500 px-4 py-2 rounded"
            >
              Close Session
            </button>
          </>
        ) : (
          <p>No active session</p>
        )}

        {session && (
  <div className="bg-gray-800 p-6 rounded mt-6">

    <h2 className="text-lg mb-4">📊 Draw Pool Summary</h2>

    <div className="grid grid-cols-2 gap-4 text-sm">

      <p><strong>File:</strong> {session.fileName}</p>

      <p><strong>Total Records:</strong> {session.totalRecords}</p>
      <p><strong>Unique Numbers:</strong> {session.uniqueNumbers}</p>

      <p><strong>Duplicates:</strong> {session.duplicateCount}</p>
      <p><strong>Number Length:</strong> {session.numberLength}</p>

      <p><strong>Draw Count:</strong> {session.drawnCount}</p>

      <p><strong>Max Winners:</strong> {session.maxWinners}</p>
      <p><strong>Remaining:</strong> {session.maxWinners - session.drawnCount}</p>

    </div>

  </div>
)}
      </div>
    </div>
  );
}