import { defineStore } from "pinia";
import type { IUserLoginInput } from "../types/stores/authStore";
import { axiosInstance } from "../services/api";
import type { AxiosResponse } from "axios";
import { useCookies } from "vue3-cookies"

export const useAuthStore = defineStore("auth", () => {

    // todo: rota de registro e etc
  const { cookies } = useCookies()

  async function login(user: IUserLoginInput): Promise<AxiosResponse> {
    const resp = await axiosInstance.post("/logar", user)

    cookies.set("refreshToken", resp.data.refreshToken, "15d", "/")
    cookies.set("accessToken", resp.data.accessToken, "15d", "/")

    return resp
}

    return { login }
})