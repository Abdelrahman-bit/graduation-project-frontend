import { apiClient } from '@/lib/http';
import { CourseDTO } from '@/app/services/courseService';

export interface JoinRequest {
   _id: string;
   firstname: string;
   lastname: string;
   email: string;
   phone: string;
   status: 'pending' | 'approved' | 'rejected';
}

export const getJoinRequests = async () => {
   const { data } = await apiClient.get<{
      status: string;
      applications: JoinRequest[];
   }>('/admin/dashboard/applicationRequest');
   return data.applications;
};

export const updateJoinRequestStatus = async (
   id: string,
   status: 'approved' | 'rejected'
) => {
   const { data } = await apiClient.patch<{
      status: string;
      message: string;
   }>(`/admin/dashboard/applicationRequest/${id}`, { status });
   return data;
};

export const getInReviewCourses = async () => {
   const { data } = await apiClient.get<{
      status: string;
      data: CourseDTO[];
   }>('/admin/courses/review');
   return data.data;
};

export const updateCourseStatus = async (
   courseId: string,
   status: 'published' | 'rejected'
) => {
   const { data } = await apiClient.patch<{
      status: string;
      message: string;
   }>(`/admin/courses/${courseId}/status`, { status });
   return data;
};

export interface Instructor {
   _id: string;
   firstname: string;
   lastname: string;
   email: string;
   phone?: string;
   avatar?: string;
   courses: CourseDTO[];
   createdAt: string;
}

// Real Search Instructors
export const searchInstructors = async (name?: string) => {
   const { data } = await apiClient.get<{
      status: string;
      data: Instructor[];
   }>('/admin/instructors', {
      params: { firstname: name },
   });
   return data.data;
};

export const getInstructorById = async (id: string) => {
   const { data } = await apiClient.get<{
      status: string;
      data: Instructor;
   }>(`/admin/instructors/${id}`);
   return data.data;
};

export const deleteInstructor = async (id: string) => {
   const { data } = await apiClient.delete<{ status: string; message: string }>(
      `/admin/instructors/${id}`
   );
   return data;
};

// ==========================================
//  NEW DASHBOARD MOCK DATA
// ==========================================

export interface DashboardStats {
   pendingRequests: number;
   totalInstructors: number;
   totalStudents: number;
   activeCourses: number;
}

export interface GrowthData {
   name: string;
   students: number;
   instructors: number;
}

export interface RecentBooking {
   id: string;
   hall: string;
   instructor: string;
   date: string;
}

export interface RecentActivity {
   id: string;
   type: 'new_course' | 'registration' | 'booking';
   user: string;
   action: string;
   time: string;
}

export interface DashboardOverviewDTO {
   stats: DashboardStats;
   growthChart: GrowthData[];
   recentBookings: RecentBooking[];
   recentActivities: RecentActivity[];
}

// Real Dashboard Overview
export const getDashboardOverview = async () => {
   const { data } = await apiClient.get<{
      status: string;
      data: DashboardOverviewDTO;
   }>('/admin/dashboard/overview');
   return data.data;
};

// ==========================================
//  STUDENTS MANAGEMENT
// ==========================================

export interface Student {
   _id: string;
   firstname: string;
   lastname: string;
   email: string;
   phone?: string;
   createdAt: string;
   role: string;
   avatar?: string;
}

export const searchStudents = async (query?: string) => {
   const { data } = await apiClient.get<{ status: string; data: Student[] }>(
      '/admin/students',
      { params: { search: query } }
   );
   return data.data;
};

export const getStudentById = async (id: string) => {
   const { data } = await apiClient.get<{
      status: string;
      data: any; // Can be typed as Student
   }>(`/admin/students/${id}`);
   return data.data;
};

export const deleteStudent = async (id: string) => {
   await apiClient.delete(`/admin/students/${id}`);
};

// ==========================================
//  ALL COURSES MANAGEMENT (Mocked)
// ==========================================

export const getAllCourses = async (search?: string, status?: string) => {
   const { data } = await apiClient.get<{ status: string; data: CourseDTO[] }>(
      '/admin/courses',
      {
         params: { search, status },
      }
   );
   return data.data;
};

// ==========================================
//  HALLS MANAGEMENT
// ==========================================
export interface HallSlot {
   id: string;
   day: string; // e.g., "Sunday", "Monday"
   startTime: string; // "09:00"
   endTime: string; // "11:00"
}

export interface HallFacilities {
   hasAC: boolean;
   hasWhiteboard: boolean;
   hasInteractiveScreen: boolean;
   hasSoundSystem: boolean;
   hasMic: boolean;
   hasProjector: boolean;
   hasWifi: boolean;
}

export interface Hall {
   _id: string;
   name: string;
   capacity: number;
   location: string;
   pricePerHour: number;
   images?: string[];
   facilities: string[]; // Changed from object to array of strings
   availability?: boolean;
}

// Real Halls API
export const getHalls = async () => {
   const { data } = await apiClient.get<{
      status: string;
      data: Hall[];
   }>('/hall'); // Changed from /admin/halls to /hall to allow Instructor access
   return data.data;
};

export const createHall = async (data: any) => {
   // Assuming data includes name, capacity, etc.
   const { data: response } = await apiClient.post<{
      status: string;
      data: Hall;
   }>('/hall', data);
   return response;
};

export const updateHall = async (id: string, data: any) => {
   const { data: response } = await apiClient.patch<{
      status: string;
      data: Hall;
   }>(`/hall/${id}`, data);
   return response;
};

export const deleteHall = async (id: string) => {
   await apiClient.delete(`/hall/${id}`);
};

export const getHallDetails = async (id: string) => {
   const { data: response } = await apiClient.get<{
      status: string;
      data: any; // Type strictly if possible
   }>(`/hall/${id}`);
   return response.data;
};

export const getHallStatus = async (date: string) => {
   const { data: response } = await apiClient.get<{
      status: string;
      data: any[]; // List of halls with daySlots/dayBookings
   }>(`/hall/status?date=${date}`);
   return response.data;
};

export const deleteSlotsByDate = async (hallId: string, date: string) => {
   const { data: response } = await apiClient.delete<{
      status: string;
      message: string;
   }>(`/hall/${hallId}/slots?date=${date}`);
   return response;
};

// ==========================================
//  BOOKINGS MANAGEMENT (Mocked)
// ==========================================
export interface Booking {
   id: string;
   hallId: string;
   hallName: string;
   instructorId: string;
   instructorName: string;
   instructorAvatar?: string;
   course?: {
      basicInfo: {
         title: string;
      };
   };
   title: string;
   date: string; // YYYY-MM-DD
   startTime: string;
   endTime: string;
   status: 'pending' | 'approved' | 'rejected' | 'cancelled';
   type: 'class' | 'event' | 'maintenance';
   attendees: number;
   maxCapacity: number;
}

// Mock Bookings Database (Keeping for reference if needed, but createBooking is real now)
let MOCK_BOOKINGS_DB: Booking[] = [];

// 1. Get Bookings (Filter by Date & Search)
export const getBookings = async (date: string, searchQuery: string = '') => {
   // ... keep validation/filter logic if needed or replace with real API
   return [];
};

const isTimeOverlapping = (
   start1: string,
   end1: string,
   start2: string,
   end2: string
) => {
   // (StartA < EndB) && (EndA > StartB)
   return start1 < end2 && end1 > start2;
};

// 2. Create Booking (Real API)
export const createBooking = async (data: {
   hall: string;
   slot: string;
   course: string;
}) => {
   const { data: response } = await apiClient.post<{
      status: string;
      data: Booking;
   }>('/booking', { slot: data.slot, course: data.course }); // Backend uses /booking (singular)
   return response;
};

// ==========================================
//  SLOT MANAGEMENT
// ==========================================
export const createSlot = async (
   hallId: string,
   data: { startTime: Date | string; endTime: Date | string }
) => {
   const { data: response } = await apiClient.post<{
      status: string;
      data: HallSlot;
   }>(`/hall/${hallId}/slots`, data);
   return response;
};

export const updateSlot = async (
   id: string,
   data: { startTime: Date | string; endTime: Date | string }
) => {
   const { data: response } = await apiClient.patch<{
      status: string;
      data: HallSlot;
   }>(`/slot/${id}`, data);
   return response;
};

export const deleteSlot = async (id: string) => {
   await apiClient.delete(`/slot/${id}`);
};

// 3. Update Status (Approve/Reject)
export const updateBookingStatus = async (id: string, status: any) => {
   await new Promise((resolve) => setTimeout(resolve, 500));
   const index = MOCK_BOOKINGS_DB.findIndex((b) => b.id === id);
   if (index !== -1) {
      MOCK_BOOKINGS_DB[index].status = status;
   }
   return { status: 'success', message: `Booking ${status}` };
};

// 4. Update Booking Details (Edit) - Partial Update
export const updateBookingDetails = async (
   id: string,
   data: Partial<Booking>
) => {
   await new Promise((resolve) => setTimeout(resolve, 800));
   const index = MOCK_BOOKINGS_DB.findIndex((b) => b.id === id);
   if (index !== -1) {
      MOCK_BOOKINGS_DB[index] = { ...MOCK_BOOKINGS_DB[index], ...data };
   }
   return { status: 'success', message: 'Booking updated successfully' };
};

// 5. Delete Booking
// 5. Cancel/Delete Booking
export const cancelBooking = async (id: string) => {
   const { data } = await apiClient.delete<{ status: string; message: string }>(
      `/booking/${id}`
   );
   return data;
};

export const deleteBooking = cancelBooking;
