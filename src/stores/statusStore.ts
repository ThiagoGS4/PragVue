import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetStatusesResponse } from "../types/stores/statusStore";

export const useStatusStore = defineStore("status", () => {
  
    async function getStatuses(): Promise<IGetStatusesResponse[]>{
        const resp = await axiosInstance.get('/status')
        return resp.data
    }
  return { getStatuses };
});
