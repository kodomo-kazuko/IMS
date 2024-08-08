"use client";
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API, // Set your API base URL in .env.local
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;