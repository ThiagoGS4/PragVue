export type CalendarType =
  | "month"
  | "week"
  | "day"
  | "category"
  | "4day"
  | "custom-daily"
  | "custom-weekly";

export interface ICalendarEvents {
  id?: number,
  name: string;
  start: Date;
  end: Date;
  color: string;
  timed: boolean;
  notes: string;
  completed?: Date | null;
  property: number;
  plague: number;
  service: number;
  status: number;
  technician: number;
}
