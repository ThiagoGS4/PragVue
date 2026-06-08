import { defineStore } from "pinia";
import type { IUserLoginRegisterInput } from "../types/stores/authStore";
import { axiosInstance } from "../services/api";
import type { AxiosResponse } from "axios";
import { useCookies } from "vue3-cookies";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const { cookies } = useCookies();
  const accessToken = ref<string | null>(cookies.get("accessToken") ?? null)

  async function login(user: IUserLoginRegisterInput): Promise<AxiosResponse> {
    const resp = await axiosInstance.post("/logar", user);

    cookies.set("refreshToken", resp.data.refreshToken, "15d", "/");
    cookies.set("accessToken", resp.data.accessToken, "15d", "/");

    return resp;
  }

  async function registrar(
    user: IUserLoginRegisterInput,
  ): Promise<AxiosResponse> {
    const resp = await axiosInstance.post("/registrar", user);

    return resp;
  }

  function hydrate() {
    accessToken.value = cookies.get("accessToken") || null;
  }

async function checkAuth(): Promise<boolean> {
  try {
    await axiosInstance.get("/me")

    accessToken.value = cookies.get("accessToken") ?? null
    return !!accessToken.value && !isTokenExpired(accessToken.value)
  } catch (error) {
    accessToken.value = null
    cookies.remove("accessToken")
    cookies.remove("refreshToken")
    return false
  }
}

const isAuthenticated = computed(() => {
  return !!accessToken.value && !isTokenExpired(accessToken.value)
})

  function parseJwt(token: string) {
    try {
      const [, payload] = token.split(".");

      if (!payload) return null;

      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  function isTokenExpired(token: string) {
    const payload = parseJwt(token);
    if (!payload?.exp) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
  }

  function logout() {
    accessToken.value = null;
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
  }
  return { login, registrar, checkAuth, isAuthenticated, hydrate, logout, accessToken };
});
