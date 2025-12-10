import {
   LayoutDashboard,
   PlusCircle,
   BookOpen,
   Settings,
   BookCheck,
   UserPlus,
   PackagePlus,
   MessageSquare,
   Wallet,
   Users,
   GraduationCap,
   Building,
   CalendarCheck,
   LogOut,
} from 'lucide-react';

export const getSidebarItems = (
   role: 'instructor' | 'student' | 'admin',
   counts?: {
      joinRequests?: number;
      courseRequests?: number;
      bookingRequests?: number;
   }
) => {
   const commonItems = [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
   ];

   let items = [];

   switch (role) {
      case 'instructor':
         items = [
            {
               label: 'Create New Course',
               icon: PlusCircle,
               href: '/dashboard/instructor/create-course',
            },
            {
               label: 'My Courses',
               icon: BookOpen,
               href: '/dashboard/instructor/courses',
            },
            {
               label: 'Messages',
               icon: MessageSquare,
               href: '/dashboard/instructor/messages',
            },
            {
               label: 'Earnings',
               icon: Wallet,
               href: '/dashboard/instructor/earnings',
            },
            {
               label: 'settings',
               icon: Settings,
               href: '/dashboard/instructor/settings',
            },
            {
               label: 'dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/instructor',
            },
         ];
         break;

      case 'admin':
         items = [
            {
               label: 'Dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/admin',
            },
            {
               label: 'Join Requests',
               icon: UserPlus,
               href: '/dashboard/admin/join-requests',
               badge: counts?.joinRequests,
            },
            {
               label: 'Course Requests',
               icon: PackagePlus,
               href: '/dashboard/admin/course-requests',
               badge: counts?.courseRequests,
            },
            {
               label: 'Instructors',
               icon: Users,
               href: '/dashboard/admin/instructors',
            },
            {
               label: 'Students',
               icon: GraduationCap,
               href: '/dashboard/admin/students',
            },
            {
               label: 'All Courses',
               icon: BookOpen,
               href: '/dashboard/admin/courses',
            },
            {
               label: 'Manage Halls',
               icon: Building,
               href: '/dashboard/admin/halls',
            },
            {
               label: 'Booking Requests',
               icon: CalendarCheck,
               href: '/dashboard/admin/bookings',
               badge: counts?.bookingRequests,
            },
            {
               label: 'Settings',
               icon: Settings,
               href: '/dashboard/admin/settings',
            },
         ];
         break;

      default:
         items = [...commonItems];
         break;
   }
   return items;
};
