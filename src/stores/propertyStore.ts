import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetPropertiesResponse } from "../types/stores/propertyStore";
import type { AxiosResponse } from "axios";

export const usePropertyStore = defineStore("property", () => {
  
    async function getProperties(): Promise<IGetPropertiesResponse[]>{
        const resp = await axiosInstance.get('/properties')
        return resp.data
    }
  
    async function insertProperty(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirProperties', payload)
        return resp
    }
  
    async function editProperty(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarProperties', payload)
        return resp
    }
  
    async function deleteProperty(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/properties/${id}`)
        return resp
    }
  return { getProperties, insertProperty, editProperty, deleteProperty };
});
