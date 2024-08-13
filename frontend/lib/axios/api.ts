"use client";

import axios from "axios";

const getAPIToken = () => {
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token") || "";
  }
  return "";
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getAPIToken()}`,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAPIToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
