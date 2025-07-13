// src/services/authService.js

import { signupApiUrl, loginApiUrl, logoutApiUrl, childRegisterApiUrl, API_URL } from "./apiUrl";

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong');
  }
  return data;
};

export const registerUser = async (userData) => {
  const apiData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: userData.email,
    password: userData.password,
    type: userData.type,
    phone_num: userData.phone,
    language: userData.language,
    ...(userData.type === 'specialist' && {
      bio: userData.bio,
      specialization: userData.specialization
    })
  };

  const response = await fetch(`${signupApiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiData),
  });

  return handleResponse(response);
};

export const loginUser = async (email, password) => {

  const response = await fetch(`${loginApiUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, FETCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  // console.log("authservice.js: login response", response);

  return handleResponse(response);
};


export const logoutUser = async () => {
  const response = await fetch(`${logoutApiUrl}`, {
    method: 'POST',
    credentials: 'include',
  });

  return handleResponse(response);
};


export const getMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

export const registerChild = async (childData) => {
  const apiData = {
    username: childData.username,
    password: childData.password,
    first_name: childData.firstName,
    last_name: childData.lastName,
    phone_num: childData.phone,
    language: childData.language || 'en',
    // email: childData.email,
    // type: 'child',
    // age: childData.age,
    // gender: childData.gender,
    // diagnosis: childData.diagnosis,
    // parent_id: childData.parentId
  };


  const response = await fetch(`${childRegisterApiUrl}`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(apiData),
  });

  return handleResponse(response);

};
