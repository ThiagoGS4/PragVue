import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetServicesResponse } from "../types/stores/servicesStore";
import type { AxiosResponse } from "axios";

export const useServiceStore = defineStore("service", () => {
  
    async function getServices(): Promise<IGetServicesResponse[]>{
        const resp = await axiosInstance.get('/services')
        return resp.data
    }
    async function insertService(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirServices', payload)
        return resp
    }
  
    async function editService(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarServices', payload)
        return resp
    }
  
    async function deleteService(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/services/${id}`)
        return resp
    }
  return { getServices, insertService, editService, deleteService };
});
