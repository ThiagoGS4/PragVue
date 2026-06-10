import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetPlaguesResponse } from "../types/stores/plagueStore";

export const usePlagueStore = defineStore("plague", () => {
  
    async function getPlagues(): Promise<IGetPlaguesResponse[]>{
        const resp = await axiosInstance.get('/plagues')
        return resp.data
    }
  return { getPlagues };
});
