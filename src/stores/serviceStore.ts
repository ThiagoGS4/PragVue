import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetServicesResponse } from "../types/stores/servicesStore";

export const useServiceStore = defineStore("service", () => {
  
    async function getServices(): Promise<IGetServicesResponse[]>{
        const resp = await axiosInstance.get('/services')
        return resp.data
    }
  return { getServices };
});
