
import axios from "axios";
import { useCookies } from "vue3-cookies";
import { useAuthStore } from "../stores/authStore";

const apiUrl = import.meta.env.VITE_API_URL

const { cookies } = useCookies()

const freeRoutes = ["/login", "/refreshLogin", "/register"]

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { Authorization: extractAccessToken() ? `Bearer ${extractAccessToken()}`: null },
});

function extractAccessToken(){
  return cookies.get("accessToken")
}

axiosInstance.interceptors.request.use(
    (config) => {
      const token = extractAccessToken();
      if (token) {
        config.headers["Authorization"] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const authStore = useAuthStore()
      // pegando requisição que foi tentada sem sucesso
      const originalConfig = err.config;

      if (!freeRoutes.includes(originalConfig.url) && err.response) {
        // access token expirado retoranando 401
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await axiosInstance.post("/refreshLogin", {
              refreshToken: cookies.get("refreshToken"),
            });

            const { accessToken, refreshToken } = rs.data;

            authStore.accessToken = accessToken
            cookies.set("accessToken", accessToken)
            cookies.set("refreshToken", refreshToken)

            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );