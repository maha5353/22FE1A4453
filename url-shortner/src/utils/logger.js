// Simple logger that stores logs in localStorage
export function logEvent(message, details = {}) {
  const log = {
    time: new Date().toLocaleString(),
    message,
    ...details,
  };
  let oldLogs = JSON.parse(localStorage.getItem("logs")) || [];
  oldLogs.push(log);
  localStorage.setItem("logs", JSON.stringify(oldLogs));
}
