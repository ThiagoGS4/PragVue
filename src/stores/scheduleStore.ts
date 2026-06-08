import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetSchedulesResponse } from "../types/views/agendamentos";

export const useScheduleStore = defineStore("schedule", () => {
  
    async function getSchedules(): Promise<IGetSchedulesResponse[]>{
        const resp = await axiosInstance.get('/schedules')
        return resp.data
    }
  return { getSchedules };
});
