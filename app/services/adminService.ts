import { apiClient } from '@/lib/http';
import { CourseDTO } from '@/app/services/courseService';

export interface JoinRequest {
   _id: string;
   name: string;
   email: string;
   phone: string;
   status: 'pending' | 'approved' | 'rejected';
}

export const getJoinRequests = async () => {
   // const { data } = await apiClient.get<{
   //    status: string;
   //    applications: JoinRequest[];
   // }>('/admin/dashboard/applicationRequest');
   // return data.applications;

   // MOCK DATA (For Testing)
   await new Promise((resolve) => setTimeout(resolve, 1000));
   return [
      {
         _id: '1',
         name: 'Ahmed Ali',
         email: 'ahmed@example.com',
         phone: '01012345678',
         status: 'pending',
      },
      {
         _id: '2',
         name: 'Sarah Mohamed',
         email: 'sarah@example.com',
         phone: '01123456789',
         status: 'pending',
      },
      {
         _id: '3',
         name: 'John Doe',
         email: 'john@example.com',
         phone: '01298765432',
         status: 'pending',
      },
   ] as JoinRequest[];
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
   name: string;
   email: string;
   courses: CourseDTO[];
}

export const searchInstructors = async (name: string) => {
   // const { data } = await apiClient.get<{
   //    status: string;
   //    data: Instructor[];
   // }>('/admin/instructors', {
   //    params: { name },
   // });
   // return data.data;

   // MOCK DATA (For Testing)
   await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay

   const mockInstructors: Instructor[] = [
      {
         _id: 'inst_1',
         name: 'Cameron Williamson',
         email: 'cameron.w@example.com',
         courses: [
            {
               _id: 'c_1',
               basicInfo: {
                  title: 'Advanced React Patterns',
                  price: 49.99,
                  category: 'Development',
               },
               price: { amount: 49.99 }, // Ensure structure matches your DTO
               status: 'published',
            },
            {
               _id: 'c_2',
               basicInfo: {
                  title: 'Next.js 14 Full Course',
                  price: 39.99,
                  category: 'Development',
               },
               price: { amount: 39.99 },
               status: 'draft',
            },
         ] as any, // Casting to avoid deep type matching issues with partial mock data
      },
      {
         _id: 'inst_2',
         name: 'Jane Cooper',
         email: 'jane.cooper@example.com',
         courses: [
            {
               _id: 'c_3',
               basicInfo: {
                  title: 'UI/UX Design Masterclass',
                  price: 89.0,
                  category: 'Design',
               },
               price: { amount: 89.0 },
               status: 'published',
            },
         ] as any,
      },
      {
         _id: 'inst_3',
         name: 'Wade Warren',
         email: 'wade.warren@example.com',
         courses: [], // Instructor with no courses
      },
      {
         _id: 'inst_4',
         name: 'Esther Howard',
         email: 'esther.howard@gmail.com',
         courses: [
            {
               _id: 'c_4',
               basicInfo: {
                  title: 'Digital Marketing 101',
                  price: 25.0,
                  category: 'Marketing',
               },
               price: { amount: 25.0 },
               status: 'rejected',
            },
            {
               _id: 'c_5',
               basicInfo: {
                  title: 'SEO Strategies 2025',
                  price: 45.0,
                  category: 'Marketing',
               },
               price: { amount: 45.0 },
               status: 'review',
            },
         ] as any,
      },
      {
         _id: 'inst_5',
         name: 'Brooklyn Simmons',
         email: 'brooklyn.s@example.com',
         courses: [
            {
               _id: 'c_6',
               basicInfo: {
                  title: 'Flutter Mobile Dev',
                  price: 59.99,
                  category: 'Development',
               },
               price: { amount: 59.99 },
               status: 'published',
            },
         ] as any,
      },
   ];

   // Simple Search Logic
   if (!name || name.trim() === '') {
      return mockInstructors;
   }

   const lowerName = name.toLowerCase();
   return mockInstructors.filter(
      (inst) =>
         inst.name.toLowerCase().includes(lowerName) ||
         inst.email.toLowerCase().includes(lowerName)
   );
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

// Mock function for Dashboard Overview (Since backend is not ready)
export const getDashboardOverview = async () => {
   /* // TODO: Uncomment when backend is ready
   const { data } = await apiClient.get<{ status: string; data: DashboardOverviewDTO }>('/admin/dashboard/overview');
   return data.data; 
   */

   // Returning Mock Data for now
   await new Promise((resolve) => setTimeout(resolve, 1000));
   return {
      stats: {
         pendingRequests: 12, // This could also be calculated from getJoinRequests().length
         totalInstructors: 1240,
         totalStudents: 45600,
         activeCourses: 3800,
      },
      growthChart: [
         { name: 'Jan', students: 400, instructors: 20 },
         { name: 'Feb', students: 300, instructors: 15 },
         { name: 'Mar', students: 550, instructors: 30 },
         { name: 'Apr', students: 450, instructors: 25 },
         { name: 'May', students: 600, instructors: 40 },
         { name: 'Jun', students: 700, instructors: 50 },
      ],
      recentBookings: [
         {
            id: '1',
            hall: 'Main Hall',
            instructor: 'Kevin G.',
            date: '2025-12-20',
         },
         {
            id: '2',
            hall: 'Lab 101',
            instructor: 'Sara M.',
            date: '2025-12-21',
         },
      ],
      recentActivities: [
         {
            id: '1',
            type: 'new_course',
            user: 'Kevin Gilbert',
            action: 'Submitted "Advanced React Patterns"',
            time: 'Just now',
         },
         {
            id: '2',
            type: 'registration',
            user: 'Sraboni A.',
            action: 'New student registration',
            time: '5 mins ago',
         },
         {
            id: '3',
            type: 'booking',
            user: 'John Doe',
            action: 'Requested "Main Conference Hall"',
            time: '1 hour ago',
         },
      ],
   } as DashboardOverviewDTO;
};

// ==========================================

export interface Student {
   _id: string;
   name: string;
   email: string;
   phone?: string;
   joinedAt: string;
   enrolledCoursesCount: number;
   avatar?: string;
}

export const searchStudents = async (query: string) => {
   /* // REAL BACKEND CONNECTION
   const { data } = await apiClient.get<{ status: string; data: Student[] }>('/admin/students', { params: { query } });
   return data.data;
   */

   // MOCK DATA
   await new Promise((resolve) => setTimeout(resolve, 800));

   const mockStudents: Student[] = [
      {
         _id: 'st_1',
         name: 'Sraboni A.',
         email: 'sraboni@example.com',
         phone: '+1234567890',
         joinedAt: '2024-01-15',
         enrolledCoursesCount: 4,
         avatar: 'https://i.pravatar.cc/150?u=sraboni',
      },
      {
         _id: 'st_2',
         name: 'Arif B.',
         email: 'arif@example.com',
         phone: '+0987654321',
         joinedAt: '2024-02-20',
         enrolledCoursesCount: 2,
      },
      {
         _id: 'st_3',
         name: 'John Doe',
         email: 'john.doe@test.com',
         joinedAt: '2024-03-10',
         enrolledCoursesCount: 0,
      },
      {
         _id: 'st_4',
         name: 'Jane Smith',
         email: 'jane.smith@test.com',
         phone: '+1122334455',
         joinedAt: '2023-11-05',
         enrolledCoursesCount: 7,
         avatar: 'https://i.pravatar.cc/150?u=jane',
      },
      {
         _id: 'st_5',
         name: 'Michael Brown',
         email: 'michael.b@test.com',
         joinedAt: '2024-01-01',
         enrolledCoursesCount: 1,
      },
   ];

   if (!query || query.trim() === '') return mockStudents;

   const lowerQuery = query.toLowerCase();
   return mockStudents.filter(
      (s) =>
         s.name.toLowerCase().includes(lowerQuery) ||
         s.email.toLowerCase().includes(lowerQuery)
   );
};

// ==========================================
//  ALL COURSES MANAGEMENT (Mocked)
// ==========================================

export const getAllCourses = async () => {
   /* // REAL BACKEND CONNECTION
   const { data } = await apiClient.get<{ status: string; data: CourseDTO[] }>('/admin/courses');
   return data.data;
   */

   // MOCK DATA
   await new Promise((resolve) => setTimeout(resolve, 1200));

   return [
      {
         _id: '101',
         basicInfo: {
            title: 'Complete Python Bootcamp',
            price: 19.99,
            category: 'Development',
         },
         instructor: { name: 'Jose Portilla', email: 'jose@test.com' },
         status: 'published', // Active Course
         advancedInfo: {
            thumbnail: {
               url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
            },
            description: 'Learn Python like a Professional!',
            whatYouWillLearn: ['Python Basics', 'OOP'],
         },
         curriculum: { sections: [{ title: 'Intro', lectures: [{}, {}] }] },
      },
      {
         _id: '102',
         basicInfo: {
            title: 'UI/UX Design Masterclass',
            price: 89.0,
            category: 'Design',
         },
         instructor: { name: 'Brad Hussey', email: 'brad@test.com' },
         status: 'review', // Needs Review
         advancedInfo: {
            thumbnail: {
               url: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=400',
            },
            description: 'Design beautiful interfaces.',
            whatYouWillLearn: ['Figma', 'Wireframing'],
         },
         curriculum: { sections: [] },
      },
      {
         _id: '103',
         basicInfo: {
            title: 'SEO Strategies 2024',
            price: 0,
            category: 'Marketing',
         },
         instructor: { name: 'Esther Howard', email: 'esther@test.com' },
         status: 'rejected', // Rejected Course
         advancedInfo: {
            thumbnail: {
               url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400',
            },
            description: 'SEO basics.',
            whatYouWillLearn: [],
         },
         curriculum: { sections: [] },
      },
      {
         _id: '104',
         basicInfo: {
            title: 'Flutter Mobile Dev',
            price: 59.99,
            category: 'Development',
         },
         instructor: { name: 'Cameron W.', email: 'cam@test.com' },
         status: 'draft', // Draft by instructor
         advancedInfo: {
            thumbnail: {
               url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
            },
            description: 'Build apps.',
            whatYouWillLearn: [],
         },
         curriculum: { sections: [] },
      },
   ] as unknown as CourseDTO[];
};

// ==========================================
//  HALLS MANAGEMENT (Mocked)
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
   id: string;
   name: string;
   capacity: number;
   hourlyRate: number;
   image?: string; // Backend URL
   availableBooking: boolean; // True/False
   facilities: HallFacilities;
   slots: HallSlot[]; // Array of time slots
}

// --- Mock Data ---

export const getHalls = async (): Promise<Hall[]> => {
   // await apiClient.get('/admin/halls');

   // Simulate API Delay
   await new Promise((resolve) => setTimeout(resolve, 800));

   return [
      {
         id: '1',
         name: 'Main Conference Hall',
         capacity: 200,
         hourlyRate: 150,
         image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500',
         availableBooking: true,
         facilities: {
            hasAC: true,
            hasWhiteboard: true,
            hasInteractiveScreen: false,
            hasSoundSystem: true,
            hasMic: true,
            hasProjector: true,
            hasWifi: true,
         },
         slots: [
            { id: 's1', day: 'Monday', startTime: '09:00', endTime: '12:00' },
         ],
      },
      {
         id: '2',
         name: 'Training Lab A',
         capacity: 30,
         hourlyRate: 50,
         image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
         availableBooking: false,
         facilities: {
            hasAC: true,
            hasWhiteboard: true,
            hasInteractiveScreen: true,
            hasSoundSystem: false,
            hasMic: false,
            hasProjector: true,
            hasWifi: true,
         },
         slots: [],
      },
   ];
};

export const createHall = async (data: any) => {
   // In real backend, use FormData to send 'image' file
   console.log('Creating Hall Payload:', data);
   await new Promise((resolve) => setTimeout(resolve, 1000));
   return { status: 'success', message: 'Hall created successfully' };
};

export const updateHall = async (id: string, data: any) => {
   console.log(`Updating Hall ${id} Payload:`, data);
   await new Promise((resolve) => setTimeout(resolve, 1000));
   return { status: 'success', message: 'Hall updated successfully' };
};

export const deleteHall = async (id: string) => {
   await new Promise((resolve) => setTimeout(resolve, 800));
   return { status: 'success', message: 'Hall deleted successfully' };
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
