import { closeSession } from "../api/lotteryApi";

export default function SessionPanel({ session, setSession }) {

  const handleClose = async () => {
    await closeSession();
    setSession(null);
  };

  return (
    <div className="bg-black p-4 mb-4">

      <h2 className="font-bold">🧾 Session</h2>

      <p>ID: {session?.id || "-"}</p>
      <p>Status: {session?.status || "-"}</p>

      <button
        onClick={handleClose}
        className="bg-red-500 px-3 py-1 mt-2"
      >
        Close Session
      </button>

    </div>
  );
}