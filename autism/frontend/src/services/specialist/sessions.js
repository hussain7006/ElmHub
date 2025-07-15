import { API_URL } from "../apiUrl";

export const getParentByEmail = async (email) => {
  const response = await fetch(
    `${API_URL}/specialist/sessions/get_parent?email=${email}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  const data = await response.json();
  console.log("data", data);

  return data.parents.length > 0 ? data.parents[0] : null;
};
export const createSession = async (apiData) => {
  const response = await fetch(`${API_URL}/specialist/sessions`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(apiData),
  });
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  const data = await response.json();
  return data.message;
};

export const getSessionList = async () => {
  const response = await fetch(`${API_URL}/specialist/sessions`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  const data = await response.json();
  return data.sessions;
};
export const getSessionAlertsList = async (session_id) => {
  if (session_id == null) return null;
  const response = await fetch(`${API_URL}/specialist/sessions/${session_id}/alerts`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  const data = await response.json();
  return data.alerts;
};

export const completeSession = async (session_id, feedback) => {
  console.log("session_id", session_id);
  console.log("feedback", feedback);

  // return true;

  const payload = JSON.stringify({
    comments: feedback
  });

  const response = await fetch(`${API_URL}/specialist/complete_session/${session_id}`, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};

export const handleDownload = async (report_path) => {
  const response = await fetch(`${API_URL}/specialist/download-report`, {
    method: "POST",
    credentials: "include",

    body: JSON.stringify({ report_path }),
  });

  if (!response.ok) {
    alert("Report not found");
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "final_report.pdf"; // Optional: extract from path dynamically
  a.click();
  window.URL.revokeObjectURL(url);
};
