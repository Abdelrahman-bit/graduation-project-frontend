import React from 'react';
import DashboardStats from '@/components/dashboard/student/DashboardStats';
import LastWatchedCourses from '@/components/dashboard/student/LastWatchedCourses';

export default function StudentDashboardPage() {
   return (
      <div className="space-y-10">
         <DashboardStats />

         <LastWatchedCourses />
      </div>
   );
}
