import { API_URL } from "../apiUrl";


export const getSessionList = async () => {
  const response = await fetch(`${API_URL}/child/sessions`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  const data = await response.json();
  return data.sessions;
};

export const completeActivity = async (session_id, activity_id) => {


  const response = await fetch(`${API_URL}/child/complete_activity/${session_id}/${activity_id}`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data.message;
};

export const startSession = async (session_id) => {

  const response = await fetch(`${API_URL}/child/sessions/${session_id}`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data.message;
};

export const sendActivityData = async (session_id, activity_id, data) => {
  const response = await fetch(`${API_URL}/child/sessions/${session_id}/activities/${activity_id}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });

  const res = await response.json();


  if (!response.ok) {
    throw new Error(res.detail || "Something went wrong");
  }


  return {
    success: response.ok,
    message: res.message || "Activity data sent successfully",
  }

};