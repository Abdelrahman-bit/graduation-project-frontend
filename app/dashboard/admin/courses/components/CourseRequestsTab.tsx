'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getInReviewCourses,
   updateCourseStatus,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CourseDTO } from '@/app/services/courseService';
import Image from 'next/image';
import { BookOpen, Eye } from 'lucide-react';
import ConfirmationModal from '@/app/components/global/ConfirmationModal';
import CourseDetailsModal from './CourseDetailsModal';

const CourseRequestsTab = () => {
   const queryClient = useQueryClient();
   const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);
   const [confirmAction, setConfirmAction] = useState<{
      id: string;
      status: 'published' | 'rejected';
      title: string;
   } | null>(null);

   const { data: courses, isLoading } = useQuery({
      queryKey: ['inReviewCourses'],
      queryFn: getInReviewCourses,
   });

   const mutation = useMutation({
      mutationFn: ({
         courseId,
         status,
      }: {
         courseId: string;
         status: 'published' | 'rejected';
      }) => updateCourseStatus(courseId, status),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['inReviewCourses'] });
         const msg =
            variables.status === 'published'
               ? 'Course Published'
               : 'Course Rejected';
         toast.success(msg);
         setSelectedCourse(null);
         setConfirmAction(null);
      },
      onError: () => {
         toast.error('Failed to update course status');
      },
   });

   const handleActionClick = (
      course: CourseDTO,
      status: 'published' | 'rejected'
   ) => {
      setConfirmAction({
         id: course._id,
         status,
         title: course.basicInfo.title,
      });
   };

   // Called from inside the Modal (Approve/Reject buttons there)
   const handleModalAction = (
      course: CourseDTO,
      status: 'published' | 'rejected'
   ) => {
      // Close the course details modal first so confirmation modal is interactive
      setSelectedCourse(null);
      handleActionClick(course, status);
   };

   const handleConfirmAction = () => {
      if (confirmAction) {
         mutation.mutate({
            courseId: confirmAction.id,
            status: confirmAction.status,
         });
      }
   };

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
               <div
                  key={i}
                  className="h-72 bg-gray-100 rounded-xl animate-pulse"
               />
            ))}
         </div>
      );
   }

   if (!courses || courses.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            <BookOpen className="w-12 h-12 mb-3 text-orange-200" />
            <p className="font-medium">No courses pending review.</p>
         </div>
      );
   }

   return (
      <div>
         {/* --- Grid Layout (Cards) --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
               <div
                  key={course._id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
               >
                  <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                     {course.advancedInfo?.thumbnail?.url ? (
                        <Image
                           src={course.advancedInfo.thumbnail.url}
                           alt={course.basicInfo.title}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                           <BookOpen size={40} />
                        </div>
                     )}
                     <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {course.basicInfo.category}
                     </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                     <div className="flex justify-between items-start mb-2">
                        <h2 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                           {course.basicInfo.title}
                        </h2>
                     </div>

                     <div className="flex items-center gap-2 mb-4 mt-1">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 text-xs font-bold">
                           {typeof course.instructor === 'object'
                              ? course.instructor?.firstname?.charAt(0)
                              : 'U'}
                        </div>
                        <span className="text-xs text-gray-500 truncate font-medium">
                           {typeof course.instructor === 'object'
                              ? `${course.instructor?.firstname || ''} ${course.instructor?.lastname || ''}`.trim()
                              : 'Unknown'}
                        </span>
                     </div>

                     <div className="mt-auto pt-4 border-t border-gray-100">
                        <Button
                           className="w-full bg-gray-900 text-white hover:bg-orange-600 transition-colors rounded-lg h-9 text-xs"
                           onClick={() => setSelectedCourse(course)}
                        >
                           <Eye size={14} className="mr-2" /> Review Details
                        </Button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* --- Reusable Modal --- */}
         <CourseDetailsModal
            isOpen={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
            course={selectedCourse}
            isReviewMode={true}
            onApprove={(c) => handleModalAction(c, 'published')}
            onReject={(c) => handleModalAction(c, 'rejected')}
            isLoading={mutation.isPending}
         />

         <ConfirmationModal
            isOpen={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            onConfirm={handleConfirmAction}
            title={
               confirmAction?.status === 'published'
                  ? 'Approve Course'
                  : 'Reject Course'
            }
            message={
               confirmAction?.status === 'published'
                  ? `Are you sure you want to publish "${confirmAction?.title}"? It will be visible to all students.`
                  : `Are you sure you want to reject "${confirmAction?.title}"? The instructor will be notified.`
            }
            confirmText={
               confirmAction?.status === 'published'
                  ? 'Publish Course'
                  : 'Reject Course'
            }
            variant={
               confirmAction?.status === 'published' ? 'primary' : 'danger'
            }
            isLoading={mutation.isPending}
         />
      </div>
   );
};

export default CourseRequestsTab;
