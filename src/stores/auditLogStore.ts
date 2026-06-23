import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetAuditLogResponse } from "../types/stores/auditLogStore";
import { formatInTimeZone } from "date-fns-tz";

export const useAuditLogStore = defineStore("auditLog", () => {
  
    async function getAuditLog(): Promise<IGetAuditLogResponse[]>{
        const resp = await axiosInstance.get('/auditLog')

        resp.data = resp.data.map((element: IGetAuditLogResponse) => {        
            const temp = new Date(element.created_at).toISOString()
            return {
                ...element,
                created_at: formatInTimeZone(temp, 'UTC', 'dd/MM/yyyy HH:mm:ss')
            }
            })
        
        return resp.data
    }
  return { getAuditLog };
});
