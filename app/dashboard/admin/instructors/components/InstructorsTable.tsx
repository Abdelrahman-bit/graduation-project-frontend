'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchInstructors, Instructor } from '@/app/services/adminService';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
   Search,
   User,
   Mail,
   BookOpen,
   Eye,
   Loader2,
   DollarSign,
   CheckCircle,
   XCircle,
   Clock,
} from 'lucide-react';

const InstructorsTable = () => {
   const [searchQuery, setSearchQuery] = useState('');

   // Logic remains exactly the same
   const { data: instructors, isLoading } = useQuery({
      queryKey: ['instructors', searchQuery],
      queryFn: () => searchInstructors(searchQuery),
   });

   const [selectedInstructor, setSelectedInstructor] =
      useState<Instructor | null>(null);

   return (
      <div className="space-y-6">
         {/* 1. Improved Search Bar */}
         <div className="relative max-w-md">
            <Search
               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
               size={20}
            />
            <Input
               placeholder="Search for instructors by name..."
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

         {/* Main Content Area */}
         {!isLoading && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               {/* Empty State */}
               {instructors?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                     <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <User className="h-8 w-8 text-gray-400" />
                     </div>
                     <h3 className="text-lg font-medium text-gray-900">
                        No instructors found
                     </h3>
                     <p className="text-gray-500 text-sm mt-1">
                        Try searching with a different name.
                     </p>
                  </div>
               ) : (
                  <>
                     {/* A. Desktop Table View */}
                     <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Instructor Name
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Email Address
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600">
                                    Courses Count
                                 </th>
                                 <th className="p-4 text-sm font-semibold text-gray-600 text-right">
                                    Action
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {instructors?.map((instructor) => (
                                 <tr
                                    key={instructor._id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                 >
                                    <td className="p-4">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                             {instructor.name
                                                .charAt(0)
                                                .toUpperCase()}
                                          </div>
                                          <span className="font-semibold text-gray-900">
                                             {instructor.name}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                       <div className="flex items-center gap-2">
                                          <Mail
                                             size={14}
                                             className="text-gray-400"
                                          />
                                          {instructor.email}
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                          {instructor.courses?.length || 0}{' '}
                                          Courses
                                       </span>
                                    </td>
                                    <td className="p-4 text-right">
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                             setSelectedInstructor(instructor)
                                          }
                                          className="border-gray-200 text-gray-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all"
                                       >
                                          <Eye size={16} className="mr-2" />{' '}
                                          View Courses
                                       </Button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>

                     {/* B. Mobile Card View */}
                     <div className="md:hidden flex flex-col divide-y divide-gray-100">
                        {instructors?.map((instructor) => (
                           <div
                              key={instructor._id}
                              className="p-4 flex flex-col gap-4"
                           >
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                                    {instructor.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-gray-900">
                                       {instructor.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                       <Mail size={12} /> {instructor.email}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                 <span className="text-sm text-gray-600 font-medium">
                                    Total Courses
                                 </span>
                                 <span className="bg-white px-2 py-1 rounded text-sm font-bold text-gray-800 shadow-sm border border-gray-100">
                                    {instructor.courses?.length || 0}
                                 </span>
                              </div>
                              <Button
                                 variant="outline"
                                 className="w-full border-gray-200"
                                 onClick={() =>
                                    setSelectedInstructor(instructor)
                                 }
                              >
                                 View Courses Details
                              </Button>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
         )}

         {/* Improved Modal (Dialog) */}
         {selectedInstructor && (
            <Dialog
               open={!!selectedInstructor}
               onOpenChange={() => setSelectedInstructor(null)}
            >
               <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border-none rounded-2xl bg-white">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                        {selectedInstructor.name.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <DialogTitle className="text-xl font-bold text-gray-900">
                           {selectedInstructor.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                           <Mail size={14} /> {selectedInstructor.email}
                        </DialogDescription>
                     </div>
                  </div>

                  {/* Modal Body (Scrollable Table) */}
                  <div className="max-h-[60vh] overflow-y-auto p-0">
                     {!selectedInstructor.courses ||
                     selectedInstructor.courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                           <BookOpen size={32} className="mb-2 opacity-20" />
                           <p>No courses listed for this instructor.</p>
                        </div>
                     ) : (
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-white sticky top-0 z-10 shadow-sm">
                              <tr>
                                 <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                                    Course Title
                                 </th>
                                 <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                                    Price
                                 </th>
                                 <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 text-right">
                                    Status
                                 </th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {selectedInstructor.courses.map((course) => (
                                 <tr
                                    key={course._id}
                                    className="hover:bg-gray-50 transition-colors"
                                 >
                                    <td className="p-4">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                             <BookOpen size={16} />
                                          </div>
                                          <span className="font-medium text-gray-900 text-sm line-clamp-1">
                                             {course.basicInfo?.title}
                                          </span>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-gray-700">
                                       {course.price?.amount
                                          ? `$${course.price.amount}`
                                          : 'Free'}
                                    </td>
                                    <td className="p-4 text-right">
                                       <span
                                          className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                                            ${
                                               course.status === 'published'
                                                  ? 'bg-green-50 text-green-700 border border-green-100'
                                                  : course.status === 'rejected'
                                                    ? 'bg-red-50 text-red-700 border border-red-100'
                                                    : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                            }`}
                                       >
                                          {course.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
                     <Button
                        variant="outline"
                        onClick={() => setSelectedInstructor(null)}
                        className="border-gray-200"
                     >
                        Close
                     </Button>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default InstructorsTable;
