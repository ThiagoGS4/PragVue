import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetAuditLogResponse } from "../types/stores/auditLogStore";
import { format } from "date-fns";

export const useAuditLogStore = defineStore("auditLog", () => {
  
    async function getAuditLog(): Promise<IGetAuditLogResponse[]>{
        const resp = await axiosInstance.get('/auditLog')

        resp.data = resp.data.map((element: IGetAuditLogResponse) => {
            const temp = new Date(element.created_at) 
            
            return {
                ...element,
                created_at: format(temp, 'dd/MM/yyyy hh:MM:ss')
            }
            })
        
        return resp.data
    }
  return { getAuditLog };
});
