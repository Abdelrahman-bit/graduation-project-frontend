'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchStudents, Student } from '@/app/services/adminService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import {
   Search,
   User,
   Mail,
   Calendar,
   BookOpen,
   Loader2,
   Phone,
   MoreHorizontal,
} from 'lucide-react';
import Image from 'next/image';

const StudentsTable = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

   const { data: students, isLoading } = useQuery({
      queryKey: ['students', searchQuery],
      queryFn: () => searchStudents(searchQuery),
   });

   return (
      <div className="space-y-6">
         {/* 1. Search Bar */}
         <div className="relative max-w-md">
            <Search
               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
               size={20}
            />
            <Input
               placeholder="Search students by name or email..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg shadow-sm bg-white"
            />
         </div>

         {/* Loading State */}
         {isLoading && (
            <div className="flex justify-center p-12">
               <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
         )}

         {/* Main Content */}
         {!isLoading && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               {/* Empty State */}
               {students?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <User className="h-8 w-8 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-900">
                        No students found
                     </h3>
                     <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your search query.
                     </p>
                  </div>
               ) : (
                  <>
                     {/* A. Desktop Table */}
                     <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Student Name
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Email
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Joined Date
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600 text-center">
                                    Enrolled Courses
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                                    Actions
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {students?.map((student) => (
                                 <tr
                                    key={student._id}
                                    className="hover:bg-gray-50/50 transition-colors group"
                                 >
                                    <td className="p-4">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden relative border border-gray-100">
                                             {student.avatar ? (
                                                <Image
                                                   src={student.avatar}
                                                   alt={student.name}
                                                   fill
                                                   className="object-cover"
                                                />
                                             ) : (
                                                student.name
                                                   .charAt(0)
                                                   .toUpperCase()
                                             )}
                                          </div>
                                          <span className="font-semibold text-gray-900">
                                             {student.name}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                       {student.email}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                       {new Date(
                                          student.joinedAt
                                       ).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-center">
                                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                          {student.enrolledCoursesCount} Courses
                                       </span>
                                    </td>
                                    <td className="p-4 text-right">
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-gray-400 hover:text-orange-500"
                                          onClick={() =>
                                             setSelectedStudent(student)
                                          }
                                       >
                                          <MoreHorizontal size={20} />
                                       </Button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {/* B. Mobile Cards */}
                     <div className="md:hidden flex flex-col divide-y divide-gray-100">
                        {students?.map((student) => (
                           <div
                              key={student._id}
                              className="p-4 flex flex-col gap-4"
                              onClick={() => setSelectedStudent(student)}
                           >
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden relative">
                                    {student.avatar ? (
                                       <Image
                                          src={student.avatar}
                                          alt={student.name}
                                          fill
                                          className="object-cover"
                                       />
                                    ) : (
                                       student.name.charAt(0).toUpperCase()
                                    )}
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-gray-900">
                                       {student.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                       {student.email}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    {new Date(
                                       student.joinedAt
                                    ).toLocaleDateString()}
                                 </div>
                                 <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                                    {student.enrolledCoursesCount} Courses
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
         )}

         {/* Student Details Modal */}
         {selectedStudent && (
            <Dialog
               open={!!selectedStudent}
               onOpenChange={() => setSelectedStudent(null)}
            >
               <DialogContent className="max-w-md rounded-2xl border-none p-0 overflow-hidden">
                  {/* Header Background */}
                  <div className="h-24 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                     <Button
                        variant="ghost"
                        className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                        onClick={() => setSelectedStudent(null)}
                     >
                        <span className="sr-only">Close</span>
                        <span className="text-xl">×</span>
                     </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="px-6 pb-6 -mt-12">
                     <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative mx-auto mb-4">
                        {selectedStudent.avatar ? (
                           <Image
                              src={selectedStudent.avatar}
                              alt={selectedStudent.name}
                              fill
                              className="object-cover"
                           />
                        ) : (
                           <div className="w-full h-full bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600">
                              {selectedStudent.name.charAt(0).toUpperCase()}
                           </div>
                        )}
                     </div>

                     <div className="text-center mb-6">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                           {selectedStudent.name}
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">Student</p>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                           <Mail className="text-gray-400 w-5 h-5" />
                           <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">
                                 Email
                              </p>
                              <p className="text-sm text-gray-900">
                                 {selectedStudent.email}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                           <Phone className="text-gray-400 w-5 h-5" />
                           <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">
                                 Phone
                              </p>
                              <p className="text-sm text-gray-900">
                                 {selectedStudent.phone || 'N/A'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                           <BookOpen className="text-green-500 w-5 h-5" />
                           <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">
                                 Enrolled Courses
                              </p>
                              <p className="text-sm text-gray-900 font-semibold">
                                 {selectedStudent.enrolledCoursesCount} Active
                                 Courses
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-6 flex justify-center">
                        <Button
                           variant="outline"
                           className="w-full border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100"
                        >
                           Block Student
                        </Button>
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default StudentsTable;
