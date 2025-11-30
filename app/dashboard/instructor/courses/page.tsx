'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   getInstructorCourses,
   deleteCourse,
} from '@/app/services/courseService';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogClose,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { CourseDTO } from '@/app/services/courseService';
import { Trash2 } from 'lucide-react';

export default function InstructorCoursesPage() {
   const queryClient = useQueryClient();

   const { data: courses, isLoading } = useQuery({
      queryKey: ['instructorCourses'],
      queryFn: getInstructorCourses,
   });

   const deleteMutation = useMutation({
      mutationFn: deleteCourse,
      onSuccess: () => {
         toast.success('Course deleted successfully');
         queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to delete course');
      },
   });

   const handleDelete = (courseId: string) => {
      deleteMutation.mutate(courseId);
   };

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">My Courses</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course: CourseDTO) => (
               <div
                  key={course._id}
                  className="border rounded-lg p-4 shadow-sm"
               >
                  <h2 className="text-xl font-semibold">
                     {course.basicInfo.title}
                  </h2>
                  <p className="text-gray-500">{course.basicInfo.subtitle}</p>
                  <div className="mt-4 flex justify-end gap-2">
                     <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="destructive" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                           </Button>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                 This action cannot be undone. This will
                                 permanently delete the course and all its
                                 resources.
                              </DialogDescription>
                           </DialogHeader>
                           <DialogFooter>
                              <DialogClose asChild>
                                 <Button variant="ghost">Cancel</Button>
                              </DialogClose>
                              <Button
                                 variant="destructive"
                                 onClick={() => handleDelete(course._id)}
                              >
                                 Delete
                              </Button>
                           </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
