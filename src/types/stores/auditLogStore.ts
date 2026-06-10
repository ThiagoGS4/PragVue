export interface IGetAuditLogResponse {
  id: number;
  operation: string;
  method: string;
  created_by: number;
  created_at: string;
  status: number;
}