"use client";

import axios from "axios";
import { LocalRepo } from "../core/local.repo";

const getAPIToken = () => {

  if (LocalRepo.getToken()) {
    return LocalRepo.getToken() || "";
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
