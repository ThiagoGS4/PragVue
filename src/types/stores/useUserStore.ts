export interface IGetUsersResponse {
  id: number;
  username: string;
  is_active: boolean;
  created_at: string;
  roles: string[];
}