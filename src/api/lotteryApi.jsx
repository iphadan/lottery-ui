const BASE_URL = "http://localhost:8000";

export async function uploadCsv(file, maxWinners) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("maxWinners", maxWinners);

  const res = await fetch(`${BASE_URL}/api/lottery/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getActiveSession() {
  const res = await fetch(`${BASE_URL}/api/session/active`);
  return res.json();
}

export async function drawWinner() {
  const res = await fetch(`${BASE_URL}/api/draw/winner`, {
    method: "POST",
  });
  return res.json();
}

export async function getResults(sessionId) {
  const res = await fetch(`${BASE_URL}/api/results/session/${sessionId}`);
  return res.json();
}

export async function closeSession() {
  const res = await fetch(`${BASE_URL}/api/session/close`, {
    method: "POST",
  });
  return res.text();
}