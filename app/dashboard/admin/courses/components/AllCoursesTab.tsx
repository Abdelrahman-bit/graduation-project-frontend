'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCourses } from '@/app/services/adminService';
import { Input } from '@/components/ui/input';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Search,
   MoreHorizontal,
   BookOpen,
   Calendar,
   Loader2,
   DollarSign,
   Tag,
   Filter,
} from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import CourseDetailsModal from './CourseDetailsModal';
import { CourseDTO } from '@/app/services/courseService';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

const AllCoursesTab = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [debouncedSearch] = useDebounce(searchTerm, 500);
   const [statusFilter, setStatusFilter] = useState('all');
   const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);

   const { data: courses, isLoading } = useQuery({
      queryKey: ['allCourses', debouncedSearch, statusFilter],
      queryFn: () => getAllCourses(debouncedSearch, statusFilter),
   });

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'published':
            return (
               <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
               >
                  Active
               </Badge>
            );
         case 'review':
            return (
               <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
               >
                  Review
               </Badge>
            );
         case 'rejected':
            return (
               <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
               >
                  Rejected
               </Badge>
            );
         case 'draft':
            return (
               <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200"
               >
                  Draft
               </Badge>
            );
         default:
            return <Badge variant="outline">{status}</Badge>;
      }
   };

   return (
      <div className="space-y-4">
         {/* Tools Bar */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
            <div className="relative w-full sm:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
               <Filter className="w-4 h-4 text-gray-500" />
               <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value)}
               >
                  <SelectTrigger className="w-[180px]">
                     <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Statuses</SelectItem>
                     <SelectItem value="published">Published</SelectItem>
                     <SelectItem value="review">Pending Review</SelectItem>
                     <SelectItem value="draft">Draft</SelectItem>
                     <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Table */}
         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead>Course</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead className="text-right">Actions</TableHead> */}
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell colSpan={5} className="h-48 text-center">
                              <div className="flex justify-center">
                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : !courses || courses.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={5} className="h-48 text-center">
                              <p className="text-muted-foreground">
                                 No courses found.
                              </p>
                           </TableCell>
                        </TableRow>
                     ) : (
                        courses.map((course) => (
                           <TableRow
                              key={course._id}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => setSelectedCourse(course)}
                           >
                              <TableCell className="max-w-[300px]">
                                 <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 truncate">
                                       {course.basicInfo.title}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                       <Tag className="h-3 w-3" />
                                       {course.basicInfo.category}
                                    </span>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 relative overflow-hidden">
                                       {typeof course.instructor === 'object' &&
                                       course.instructor?.avatar ? (
                                          <Image
                                             src={course.instructor.avatar}
                                             alt="Instructor"
                                             fill
                                             className="object-cover"
                                          />
                                       ) : typeof course.instructor ===
                                         'object' ? (
                                          course.instructor?.firstname?.charAt(
                                             0
                                          )
                                       ) : (
                                          'U'
                                       )}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                       {typeof course.instructor === 'object'
                                          ? `${course.instructor?.firstname || ''} ${course.instructor?.lastname || ''}`
                                          : 'Unknown'}
                                    </span>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-1 font-medium text-gray-700">
                                    {course.basicInfo.price === 0 ? (
                                       <span className="text-green-600">
                                          Free
                                       </span>
                                    ) : (
                                       <>
                                          <DollarSign className="h-3 w-3 text-gray-400" />
                                          {course.basicInfo.price}
                                       </>
                                    )}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 {getStatusBadge(course.status)}
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </div>

         {/* Course Details Modal */}
         <CourseDetailsModal
            isOpen={!!selectedCourse}
            onClose={() => setSelectedCourse(null)}
            course={selectedCourse}
         />
      </div>
   );
};

export default AllCoursesTab;
