
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  // todo: fazer header que manda token?? acho q sim
  //headers: { "X-Custom-Header": "foobar" },
});