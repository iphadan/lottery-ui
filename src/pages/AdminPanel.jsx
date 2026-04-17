import { useState } from "react";
import UploadPanel from "../components/UploadPanel";
import SessionPanel from "../components/SessionPanel";
import DrawBox from "../components/DrawPanel";

export default function AdminPage() {
  const [session, setSession] = useState(null);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">
        🧑‍💼 Admin Panel
      </h1>

      <UploadPanel setSession={setSession} />

      <SessionPanel session={session} setSession={setSession} />

      <DrawBox session={session} />

    </div>
  );
}