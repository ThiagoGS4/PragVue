import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetPlaguesResponse } from "../types/stores/plagueStore";
import type { AxiosResponse } from "axios";

export const usePlagueStore = defineStore("plague", () => {
  
    async function getPlagues(): Promise<IGetPlaguesResponse[]>{
        const resp = await axiosInstance.get('/plagues')
        return resp.data
    }
    async function insertPlague(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirPlagues', payload)
        return resp
    }
  
    async function editPlague(payload: any): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarPlagues', payload)
        return resp
    }
  
    async function deletePlague(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/plagues/${id}`)
        return resp
    }
  return { getPlagues, insertPlague, editPlague, deletePlague };
});
