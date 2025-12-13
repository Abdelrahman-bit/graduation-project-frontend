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
   }>('/admin/halls');
   return data.data;
};

export const createHall = async (data: any) => {
   // Assuming data includes name, capacity, etc.
   const { data: response } = await apiClient.post<{
      status: string;
      data: Hall;
   }>('/admin/halls', data);
   return response;
};

export const updateHall = async (id: string, data: any) => {
   const { data: response } = await apiClient.patch<{
      status: string;
      data: Hall;
   }>(`/admin/halls/${id}`, data);
   return response;
};

export const deleteHall = async (id: string) => {
   await apiClient.delete(`/admin/halls/${id}`);
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
   title: string;
   date: string; // YYYY-MM-DD
   startTime: string;
   endTime: string;
   status: 'pending' | 'approved' | 'rejected' | 'cancelled';
   type: 'class' | 'event' | 'maintenance';
   attendees: number;
   maxCapacity: number;
}

// Mock Bookings Database
let MOCK_BOOKINGS_DB: Booking[] = [
   {
      id: 'b_1',
      hallId: 'h_1',
      hallName: 'Main Conference Hall',
      instructorId: 'i_1',
      instructorName: 'Kim Lyons',
      instructorAvatar: 'https://i.pravatar.cc/150?u=kim',
      title: 'React.js Summit 2025',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      status: 'approved',
      type: 'event',
      attendees: 45,
      maxCapacity: 200,
   },
   {
      id: 'b_2',
      hallId: 'h_2',
      hallName: 'Lab 101',
      instructorId: 'i_2',
      instructorName: 'Seth Farmer',
      instructorAvatar: 'https://i.pravatar.cc/150?u=seth',
      title: 'Python Workshop',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      status: 'pending',
      type: 'class',
      attendees: 12,
      maxCapacity: 30,
   },
   {
      id: 'b_3',
      hallId: 'h_3',
      hallName: 'Meeting Room A',
      instructorId: 'i_3',
      instructorName: 'Tatiana Rosser',
      title: 'Instructor Sync',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // غداً
      startTime: '14:00',
      endTime: '15:00',
      status: 'rejected',
      type: 'maintenance',
      attendees: 5,
      maxCapacity: 10,
   },
];

// 1. Get Bookings (Filter by Date & Search)
export const getBookings = async (date: string, searchQuery: string = '') => {
   await new Promise((resolve) => setTimeout(resolve, 500));

   // 1. فلترة حسب التاريخ
   let filtered = MOCK_BOOKINGS_DB.filter((b) => b.date === date);

   // Search Filter
   if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
         (b) =>
            b.title.toLowerCase().includes(q) ||
            b.instructorName.toLowerCase().includes(q) ||
            b.hallName.toLowerCase().includes(q)
      );
   }

   //time sorting
   return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
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

// 2. Create Booking (With Conflict Check)
export const createBooking = async (data: Partial<Booking>) => {
   await new Promise((resolve) => setTimeout(resolve, 800));

   // 1.  (Conflict Check)
   const hasConflict = MOCK_BOOKINGS_DB.some((booking) => {
      if (booking.status === 'rejected' || booking.status === 'cancelled')
         return false;

      if (booking.hallId === data.hallId && booking.date === data.date) {
         if (
            isTimeOverlapping(
               data.startTime!,
               data.endTime!,
               booking.startTime,
               booking.endTime
            )
         ) {
            return true;
         }
      }
      return false;
   });
   //end conflict check
   if (hasConflict) {
      throw new Error('This hall is already booked for this time slot.');
   }

   const newBooking: Booking = {
      id: `b_${Date.now()}`,
      hallId: data.hallId || 'h_temp',
      instructorId: 'i_me',
      instructorName: 'Current Admin',
      instructorAvatar: '',
      status: 'approved',
      type: 'class',
      attendees: 0,
      maxCapacity: 50,
      title: data.title || 'New Booking',
      date: data.date || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '10:00',
      hallName: data.hallName || 'General Hall',
      ...data,
   } as Booking;

   MOCK_BOOKINGS_DB.push(newBooking);
   return { status: 'success', message: 'Booking created successfully' };
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
export const deleteBooking = async (id: string) => {
   await new Promise((resolve) => setTimeout(resolve, 500));
   MOCK_BOOKINGS_DB = MOCK_BOOKINGS_DB.filter((b) => b.id !== id);
   return { status: 'success', message: 'Booking deleted' };
};
