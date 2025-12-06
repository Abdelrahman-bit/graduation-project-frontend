import { SignUpData } from '@/app/store/types';
import { apiClient } from '@/lib/http';

export const signUp = async (userData: SignUpData) => {
   const { data } = await apiClient.post('/auth/signup', userData);

   if (typeof window !== 'undefined' && data?.token) {
      localStorage.setItem('token', data.token);
   }

   return data;
};

export const login = async (credentials: any) => {
   const { data } = await apiClient.post('/auth/login', credentials);
   return data;
};
