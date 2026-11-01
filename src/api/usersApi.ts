import axios, { AxiosError } from 'axios';
import type { User, UserFormData } from '../types/user';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://6ae7180756b2ee1e544019f7.mockapi.io';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    if (axiosErr.response) {
      return (
        axiosErr.response.data?.message ||
        `Ошибка сервера: статус ${axiosErr.response.status}`
      );
    }
    if (axiosErr.request) {
      return 'Не удалось получить ответ от сервера. Проверьте подключение к сети и корректность URL MockAPI.';
    }
    return axiosErr.message;
  }
  return error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: UserFormData): Promise<User> => {
    const payload = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const response = await apiClient.post<User>('/users', payload);
    return response.data;
  },

  update: async (id: string, data: UserFormData): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },
};