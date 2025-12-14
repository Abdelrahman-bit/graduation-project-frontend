'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getStudentDetails } from '@/app/services/instructorService';
import { Button } from '@/components/ui/button';
import {
   ArrowLeft,
   Mail,
   Phone,
   Calendar,
   BookOpen,
   Clock,
   Loader2,
   User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function InstructorStudentProfilePage() {
   const { studentId } = useParams() as { studentId: string };
   const router = useRouter();

   const {
      data: student,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ['instructorStudent', studentId],
      queryFn: () => getStudentDetails(studentId),
      enabled: !!studentId,
   });

   if (isLoading) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
         </div>
      );
   }

   if (isError || !student) {
      return (
         <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <h2 className="text-xl font-bold text-gray-800">
               Student Not Found
            </h2>
            <p className="text-gray-500">
               This student may not be enrolled in your courses.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
         </div>
      );
   }

   const enrolledCourses = student.courses || [];

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen space-y-6">
         {/* Back Button */}
         <div>
            <Button
               variant="ghost"
               className="gap-2 text-gray-500 hover:text-gray-900"
               onClick={() => router.back()}
            >
               <ArrowLeft size={16} />
               Back
            </Button>
         </div>

         {/* Header Profile Card */}
         <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-orange-100 overflow-hidden shrink-0 relative bg-gray-100 flex items-center justify-center">
               {student.avatar ? (
                  <Image
                     src={student.avatar}
                     alt={student.firstname}
                     fill
                     className="object-cover"
                  />
               ) : (
                  <div className="text-3xl font-bold text-orange-400 bg-orange-50 w-full h-full flex items-center justify-center uppercase">
                     {student.firstname?.charAt(0)}
                     {student.lastname?.charAt(0)}
                  </div>
               )}
            </div>

            <div className="flex-1 space-y-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     {student.firstname} {student.lastname}
                  </h1>
                  {student.title && (
                     <p className="text-orange-600 font-medium mt-1">
                        {student.title}
                     </p>
                  )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                     <Mail size={16} className="text-gray-400" />
                     {student.email}
                  </div>
                  {student.phone && (
                     <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        {student.phone}
                     </div>
                  )}
                  <div className="flex items-center gap-2">
                     <Calendar size={16} className="text-gray-400" />
                     Joined {new Date(student.createdAt).toLocaleDateString()}
                  </div>
               </div>

               {student.bio && (
                  <p className="text-gray-500 text-sm mt-4">{student.bio}</p>
               )}
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                     <BookOpen size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Enrolled in Your Courses
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {enrolledCourses.length}
                     </h3>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                     <Clock size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Average Progress
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {enrolledCourses.length > 0
                           ? Math.round(
                                enrolledCourses.reduce(
                                   (acc, curr) => acc + (curr.progress || 0),
                                   0
                                ) / enrolledCourses.length
                             ) + '%'
                           : '0%'}
                     </h3>
                  </div>
               </div>
            </div>
         </div>

         {/* Enrolled Courses List */}
         <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
               Courses in Your Collection
            </h2>
            {enrolledCourses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => {
                     const thumbnail = course.advancedInfo?.thumbnail?.url;
                     return (
                        <div
                           key={course._id}
                           className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col"
                        >
                           <div className="relative h-40 w-full bg-gray-100">
                              {thumbnail ? (
                                 <Image
                                    src={thumbnail}
                                    alt={course.basicInfo.title}
                                    fill
                                    className="object-cover"
                                 />
                              ) : (
                                 <div className="flex items-center justify-center h-full text-gray-400">
                                    <BookOpen className="h-10 w-10 opacity-20" />
                                 </div>
                              )}
                           </div>
                           <div className="p-4 flex flex-col flex-1">
                              <div className="mb-2">
                                 <Badge
                                    variant={
                                       course.progress === 100
                                          ? 'default'
                                          : 'secondary'
                                    }
                                    className="mb-2"
                                 >
                                    {course.progress === 100
                                       ? 'Completed'
                                       : 'In Progress'}
                                 </Badge>
                                 <h3
                                    className="font-bold text-gray-900 line-clamp-2"
                                    title={course.basicInfo?.title}
                                 >
                                    {course.basicInfo?.title}
                                 </h3>
                              </div>

                              <div className="mt-auto space-y-3">
                                 {/* Progress Bar */}
                                 <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                       <span>Progress</span>
                                       <span>{course.progress || 0}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                       <div
                                          className="h-full bg-orange-500 rounded-full"
                                          style={{
                                             width: `${course.progress || 0}%`,
                                          }}
                                       />
                                    </div>
                                 </div>

                                 <div className="text-xs text-gray-500 border-t pt-3">
                                    Enrolled:{' '}
                                    {new Date(
                                       course.enrolledAt
                                    ).toLocaleDateString()}
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                     <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                     <h3 className="text-lg font-medium text-gray-900">
                        No Enrollments Yet
                     </h3>
                     <p className="text-sm mt-1">
                        This student has not enrolled in any of your courses.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
