
import axios from "axios";
import { useCookies } from "vue3-cookies";

const apiUrl = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { Authorization: `Bearer ${extractToken()}` },
});

function extractToken(){
  return useCookies().cookies.get("accessToken")
}