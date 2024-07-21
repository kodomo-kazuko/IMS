import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API;

console.log(baseURL);

const storedToken = localStorage.getItem("token");

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${storedToken}`,
  },
});

export default api;
