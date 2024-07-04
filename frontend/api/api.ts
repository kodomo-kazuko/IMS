import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API;

console.log(baseURL);

const api = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {},
});

export default api;
