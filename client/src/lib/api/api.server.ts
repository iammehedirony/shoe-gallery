import axios from "axios";
import { cookies } from "next/headers";

export const createServerApiClient = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const serverApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  serverApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message = error.response?.data?.message || error.message || "Server API error";
      return Promise.reject(new Error(message));
    }
  );

  return serverApi;
};
