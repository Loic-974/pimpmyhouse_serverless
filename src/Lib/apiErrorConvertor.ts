import { AxiosError } from "axios";

export function apiErrorConvertor(
  error: AxiosError<
    { error: string | undefined },
    { error: string | undefined }
  >
) {
  const errorData = error.response?.data?.error;

  return errorData ? JSON.parse(errorData)?.message : null;
}
