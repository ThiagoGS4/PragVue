import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetUsersResponse } from "../types/stores/useUserStore";

export const useUserStore = defineStore("user", () => {
  
    async function getTechnicians(): Promise<IGetUsersResponse[]>{
        const resp = await axiosInstance.get('/users')
        
        const techniciansOnly = resp.data.filter((user:IGetUsersResponse) => user.roles.includes("TECNICO"))
        return techniciansOnly
    }
  return { getTechnicians };
});
