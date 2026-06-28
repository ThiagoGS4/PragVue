import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetStatusesResponse } from "../types/stores/statusStore";
import type { AxiosResponse } from "axios";

export const useStatusStore = defineStore("status", () => {
  
    async function getStatuses(): Promise<IGetStatusesResponse[]>{
        const resp = await axiosInstance.get('/status')
        return resp.data
    }
    async function insertStatus(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirStatus', payload)
        return resp
    }
  
    async function editStatus(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarStatus', payload)
        return resp
    }
  
    async function deleteStatus(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/status/${id}`)
        return resp
    }
  return { getStatuses, insertStatus, editStatus, deleteStatus };
});
