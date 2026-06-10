import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetPropertiesResponse } from "../types/stores/propertyStore";

export const usePropertyStore = defineStore("property", () => {
  
    async function getProperties(): Promise<IGetPropertiesResponse[]>{
        const resp = await axiosInstance.get('/properties')
        return resp.data
    }
  return { getProperties };
});
