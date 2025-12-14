import { apiClient } from '@/lib/http';

export const applyForJob = async (values: {
   name: string;
   email: string;
   phone: string;
}) => {
   try {
      return await apiClient.post('/instructor/applicationRequest', values);
   } catch (error) {
      throw error;
   }
};

export const getMyCourses = async () => {
   const { data } = await apiClient.get<{
      status: string;
      results: number;
      data: any[]; // Or CourseDTO
   }>('/courses');
   return data.data;
};
