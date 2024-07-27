import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Type } from "lucide-react";

type AccountType = "employee" | "company" | "student" | "mentor";
type DecodedToken = {
  account: AccountType;
  id: number;
  iat: number;
  exp: number;
  access: number;
};

const baseURL = process.env.NEXT_PUBLIC_API;

const storedToken = localStorage.getItem("token");

export let decodedToken: DecodedToken;
if (!storedToken) {
  console.log("no token");
} else {
  decodedToken = jwtDecode(storedToken);
  console.log(decodedToken);
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${storedToken}`,
  },
});

export default api;
