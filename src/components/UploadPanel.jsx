import { useState } from "react";
import { uploadCsv } from "../api/lotteryApi";

export default function UploadPanel({ setSession }) {
  const [file, setFile] = useState(null);
  const [maxWinners, setMaxWinners] = useState(5);

  const handleUpload = async () => {
    if (!file) return;

    const data = await uploadCsv(file, maxWinners);
    setSession(data);
  };

  return (
    <div className="bg-gray-800 p-4 mb-4 rounded">

      <h2 className="font-bold mb-2">📤 Upload CSV</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        type="number"
        value={maxWinners}
        onChange={(e) => setMaxWinners(e.target.value)}
        className="text-black ml-2"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 px-4 py-2 ml-2"
      >
        Upload
      </button>

    </div>
  );
}