import { defineStore } from "pinia";
import { axiosInstance } from "../services/api";
import type { IGetSchedulesResponse, ISchedulesInput } from "../types/views/agendamentos";
import type { AxiosResponse } from "axios";

export const useScheduleStore = defineStore("schedule", () => {
  
    async function getSchedules(): Promise<IGetSchedulesResponse[]>{
        const resp = await axiosInstance.get('/schedules')
        return resp.data
    }

    async function insertSchedule(payload: ISchedulesInput): Promise<AxiosResponse>{
        const resp = await axiosInstance.post('/inserirSchedules', payload)
        return resp
    }

    async function updateSchedule(payload: ISchedulesInput): Promise<AxiosResponse>{
        const resp = await axiosInstance.put('/alterarSchedules', payload)
        return resp
    }

    async function deleteSchedule(id: number): Promise<AxiosResponse>{
        const resp = await axiosInstance.delete(`/schedules/${id}`)
        return resp
    }

  return { getSchedules, insertSchedule, updateSchedule, deleteSchedule };
});
