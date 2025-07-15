import { API_URL } from "./apiUrl";

const getProfileInfo = async (role) => {
  // fetch
  const response = await fetch(`${API_URL}/${role}/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch profile info");
  }

  const data = await response.json();
  return data;
};

export default getProfileInfo;

export const getServicesListForParent = async () => {
  const response = await fetch(`${API_URL}/parent/service`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  // console.log("in getServicesListForParent:data:", data);

  return data.services;
};

export const getChildListForParent = async () => {
  const response = await fetch(`${API_URL}/parent/child_profile`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  // console.log("in getChildListForParent:data:", data);

  return data.childs;
};

export const createSession = async (sessionData) => {
  const response = await fetch(`${API_URL}/parent/sessions`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(sessionData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
};

export const getSessionsList = async () => {
  const response = await fetch(`${API_URL}/parent/sessions`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.sessions;
};

export const getCompletedSessionsList = async () => {
  const response = await fetch(`${API_URL}/parent/completed_sessions`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.sessions;
};

export const handleDownload = async (report_path) => {
  const response = await fetch(`${API_URL}/parent/download-report`, {
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

export const updateParentProfile = async ({ role, first_name, last_name, phone_num, language, bio, specialization }) => {

  const payload = {
    first_name,
    last_name,
    phone_num,
    language,
    bio,
    specialization
  }

  console.log("payload", payload);

  const response = await fetch(`${API_URL}/${role}/profile`, {
    method: "POST",
    credentials: "include",
    // headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
};
