import React from 'react';
import AllCoursesList from './components/AllCoursesList';

const AllCoursesPage = () => {
   return (
      <div className="p-6 md:p-8 space-y-6 min-h-screen bg-[#F5F7FA]">
         <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
               <p className="text-sm text-gray-500 mt-1">
                  Manage and view all courses on the platform.
               </p>
            </div>
            {/* Optional: Add Filters here later */}
         </div>

         <AllCoursesList />
      </div>
   );
};

export default AllCoursesPage;
