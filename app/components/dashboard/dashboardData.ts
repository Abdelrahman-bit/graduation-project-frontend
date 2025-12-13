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
               label: 'dashboard',
               icon: LayoutDashboard,
               href: '/dashboard/instructor',
            },
            {
               label: 'My Courses',
               icon: BookOpen,
               href: '/dashboard/instructor/courses',
            },
            {
               label: 'Create New Course',
               icon: PlusCircle,
               href: '/dashboard/instructor/create-course',
            },
            {
               label: 'Messages',
               icon: MessageSquare,
               href: '/dashboard/instructor/messages',
            },
            {
               label: 'settings',
               icon: Settings,
               href: '/dashboard/instructor/settings',
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
               label: 'Instructors',
               icon: Users,
               href: '/dashboard/admin/instructors',
               badge: counts?.joinRequests,
            },
            {
               label: 'All Courses',
               icon: BookOpen,
               href: '/dashboard/admin/courses',
               badge: counts?.courseRequests,
            },
            {
               label: 'Students',
               icon: GraduationCap,
               href: '/dashboard/admin/students',
            },
            {
               label: 'Halls',
               icon: Building,
               href: '/dashboard/admin/halls',
            },
         ];
         break;

      default:
         items = [...commonItems];
         break;
   }
   return items;
};
