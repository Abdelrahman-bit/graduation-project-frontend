'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getStudentById } from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   ArrowLeft,
   Mail,
   Phone,
   Calendar,
   BookOpen,
   MessageSquare,
   Clock,
   Loader2,
   User,
   ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export default function StudentProfilePage() {
   const { id } = useParams() as { id: string };
   const router = useRouter();

   const { data: student, isLoading } = useQuery({
      queryKey: ['student', id],
      queryFn: () => getStudentById(id),
      enabled: !!id,
   });

   if (isLoading) {
      return (
         <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   if (!student) {
      return (
         <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <h2 className="text-xl font-bold text-gray-800">
               Student Not Found
            </h2>
            <Button onClick={() => router.back()}>Go Back</Button>
         </div>
      );
   }

   const enrolledCourses = student.courses || [];

   return (
      <div className="space-y-6">
         {/* Back Button */}
         <div>
            <Button
               variant="ghost"
               className="gap-2 text-gray-500 hover:text-gray-900"
               onClick={() => router.back()}
            >
               <ArrowLeft size={16} />
               Back to Students
            </Button>
         </div>

         {/* Header Profile Card */}
         <div className="bg-white rounded-lg border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-50 overflow-hidden shrink-0 relative bg-gray-100 flex items-center justify-center">
               {student.avatar ? (
                  <Image
                     src={student.avatar}
                     alt={student.firstname}
                     fill
                     className="object-cover"
                  />
               ) : (
                  <div className="text-3xl font-bold text-gray-400 bg-gray-100 uppercase">
                     {student.firstname?.charAt(0)}
                  </div>
               )}
            </div>

            <div className="flex-1 space-y-4">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     {student.firstname} {student.lastname}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                     Student ID: {student._id}
                  </p>
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
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                     <BookOpen size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Enrolled Courses
                     </p>
                     <h3 className="text-2xl font-bold text-gray-900">
                        {enrolledCourses.length}
                     </h3>
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                     <Clock size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-500">
                        Average Progress
                     </p>
                     <h3 className="text-lg font-bold text-gray-900">
                        {enrolledCourses.length > 0
                           ? Math.round(
                                enrolledCourses.reduce(
                                   (acc: number, curr: any) =>
                                      acc + (curr.progress || 0),
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
               Enrolled Courses
            </h2>
            {enrolledCourses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course: any) => {
                     const thumbnail =
                        course.advancedInfo?.thumbnail?.url ||
                        course.advancedInfo?.thumbnailUrl;
                     return (
                        <div
                           key={course._id}
                           className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col"
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
                                 <div className="flex items-center text-sm text-gray-500 gap-2">
                                    <User size={14} />
                                    <span>
                                       {course.instructor?.firstname}{' '}
                                       {course.instructor?.lastname}
                                    </span>
                                 </div>

                                 <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                                    <span>
                                       Progress: {course.progress || 0}%
                                    </span>
                                    <span>
                                       Enrolled:{' '}
                                       {new Date(
                                          course.enrolledAt
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <div className="bg-white rounded-lg border shadow-sm p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                     <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                     <h3 className="text-lg font-medium text-gray-900">
                        No Enrollments Yet
                     </h3>
                     <p className="text-sm mt-1">
                        This student has not enrolled in any courses.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
