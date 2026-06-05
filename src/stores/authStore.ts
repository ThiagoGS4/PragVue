import { defineStore } from "pinia";
import type { IUserLoginInput } from "../types/stores/authStore";
import { axiosInstance } from "../services/api";
import type { AxiosResponse } from "axios";

export const useAuthStore = defineStore("auth", () => {

    // todo: rota de registro e etc
    async function login(user: IUserLoginInput): Promise<AxiosResponse> {
        const resp = await axiosInstance.post("/logar", user)
        return resp.data
    }

    return { login }
})