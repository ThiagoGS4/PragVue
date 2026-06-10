import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetCustomersResponse, IUpsertCustomer } from "../types/stores/customerStore";
import type { AxiosResponse } from "axios";

export const useCustomerStore = defineStore("customer", () => {
  
    async function getCustomers(): Promise<IGetCustomersResponse[]>{
        const resp = await axiosInstance.get('/customer')
        return resp.data
    }
  
    async function insertCustomer(payload: IUpsertCustomer): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirCustomer', payload)
        return resp
    }
  
    async function updateCustomer(payload: IUpsertCustomer): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarCustomer', payload)
        return resp
    }
  
    async function deleteCustomer(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/customer/${id}`)
        return resp
    }
  return { getCustomers, insertCustomer, updateCustomer, deleteCustomer };
});
