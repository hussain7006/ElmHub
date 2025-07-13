import { API_URL } from "../apiUrl";
export const getActivitesList = async () => {
  const response = await fetch(`${API_URL}/specialist/activities`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.list;
};

export const createActivity = async (apiData) => {
  const response = await fetch(`${API_URL}/specialist/activities`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(apiData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.message;
};

export const getServicesList = async () => {
  const response = await fetch(`${API_URL}/specialist/service`, {
    method: "GET",
    credentials: "include"
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.services;
};

export const createService = async (apiData) => {
  const response = await fetch(`${API_URL}/specialist/service`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(apiData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data.list;
};