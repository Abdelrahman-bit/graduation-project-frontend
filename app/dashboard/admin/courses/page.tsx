'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseRequestsTab from './components/CourseRequestsTab';
import AllCoursesTab from './components/AllCoursesTab';

export default function CoursesPage() {
   return (
      <div className="p-6 space-y-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">
               Courses Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
               Overview of all courses and pending requests.
            </p>
         </div>

         <Tabs defaultValue="courses" className="w-full">
            <TabsList className="bg-white border p-1 w-full max-w-md grid grid-cols-2">
               <TabsTrigger
                  value="courses"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:text-orange-500 data-[state=active]:hover:text-white"
               >
                  All Courses
               </TabsTrigger>
               <TabsTrigger
                  value="requests"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:text-orange-500 data-[state=active]:hover:text-white"
               >
                  Course Requests
               </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
               <AllCoursesTab />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
               <CourseRequestsTab />
            </TabsContent>
         </Tabs>
      </div>
   );
}
