import type { AxiosError } from "axios";

type ApiErrorResponse = {
  status?: number;
  message?: string;
  errors?: Record<string, string>;
};

export function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const data = axiosError.response?.data;

  if (!data) return fallback;

  if (data.errors) {
    const details = Object.values(data.errors).join(" | ");
    return data.message ? `${data.message}: ${details}` : details;
  }

  return data.message || fallback;
}