export default function Message({ message, clear }) {
  if (!message) return null;

  return (
    <div
      className={`p-3 mb-4 rounded text-white ${
        message.type === "error"
          ? "bg-red-500"
          : message.type === "success"
          ? "bg-green-500"
          : "bg-blue-500"
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{message.text}</span>
        <button onClick={clear}>✖</button>
      </div>
    </div>
  );
}