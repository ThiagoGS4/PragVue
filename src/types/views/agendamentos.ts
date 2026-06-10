import type { Temporal } from "temporal-polyfill";

export interface IGetSchedulesResponse {
  id?: number
  scheduled_start: string;
  scheduled_end: string;
  completed_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
  properties: IProperty;
  plagues: IPlague;
  service: IService;
  status: IStatus;
  user: IUsers;
}

interface IProperty {
  id: number
  name: string
}

interface IPlague {
  id: number
  name: string
}

interface IService {
  id: number
  name: string
}

interface IStatus {
  id: number
  name: string
}

interface IUsers {
  id: number
  name: string
}

export interface ISchedulesInput {
  id?: number;
  completed_at?: Temporal.Instant | null;
  scheduled_start: Temporal.Instant;
  scheduled_end: Temporal.Instant;
  notes: string;
  properties: number;
  plagues: number;
  service: number;
  status: number;
  users: number;
}

export interface IFormData {
  id?: number
  date: string
  startTime?: Date
  endTime?: Date
  completed?: Date
  notes: string
  technicianId: number | null
  propertyId: number | null
  plagueId: number | null
  serviceId: number | null
  statusId: number | null
}