'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   UserPlus,
   Check,
   X,
   Clock,
   Trash2,
   Loader2,
   Users,
   BookOpen,
   Search,
   ArrowUpDown,
   ArrowUp,
   ArrowDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   getEnrollmentRequests,
   approveEnrollmentRequest,
   rejectEnrollmentRequest,
   getEnrolledStudents,
   removeStudentFromCourse,
   EnrollmentRequest,
   EnrolledStudent,
} from '@/app/services/instructorService';

// ===== Approval Modal =====
interface ApprovalModalProps {
   isOpen: boolean;
   onClose: () => void;
   onApprove: (durationDays: number) => void;
   studentName: string;
   courseName: string;
   isLoading: boolean;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
   isOpen,
   onClose,
   onApprove,
   studentName,
   courseName,
   isLoading,
}) => {
   const [durationDays, setDurationDays] = useState(30);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
               Approve Enrollment
            </h3>
            <p className="text-gray-600 mb-4">
               Approve <strong>{studentName}</strong> for{' '}
               <strong>{courseName}</strong>?
            </p>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Duration (days)
               </label>
               <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
               >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days (Default)</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days (6 months)</option>
                  <option value={365}>365 days (1 year)</option>
               </select>
            </div>

            <div className="flex gap-3">
               <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={() => onApprove(durationDays)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
               >
                  {isLoading ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     <Check className="w-4 h-4" />
                  )}
                  Approve
               </button>
            </div>
         </div>
      </div>
   );
};

// ===== Remove Confirmation Modal =====
interface RemoveModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   studentName: string;
   courseName: string;
   isLoading: boolean;
}

const RemoveModal: React.FC<RemoveModalProps> = ({
   isOpen,
   onClose,
   onConfirm,
   studentName,
   courseName,
   isLoading,
}) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
         <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
               Remove Student
            </h3>
            <p className="text-gray-600 mb-6">
               Are you sure you want to remove <strong>{studentName}</strong>{' '}
               from <strong>{courseName}</strong>?
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6">
               This will revoke their access to course content and chat.
            </p>

            <div className="flex gap-3">
               <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
               >
                  {isLoading ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                     <Trash2 className="w-4 h-4" />
                  )}
                  Remove
               </button>
            </div>
         </div>
      </div>
   );
};

// ===== Main Page Component =====
export default function EnrollmentRequestsPage() {
   const queryClient = useQueryClient();

   // Search and filter states
   const [searchQuery, setSearchQuery] = useState('');
   const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

   // Modal states
   const [approvalModal, setApprovalModal] = useState<{
      isOpen: boolean;
      request: EnrollmentRequest | null;
   }>({ isOpen: false, request: null });

   const [removeModal, setRemoveModal] = useState<{
      isOpen: boolean;
      student: EnrolledStudent | null;
   }>({ isOpen: false, student: null });

   // Fetch data
   const { data: requestsData, isLoading: requestsLoading } = useQuery({
      queryKey: ['enrollmentRequests'],
      queryFn: getEnrollmentRequests,
   });

   const { data: studentsData, isLoading: studentsLoading } = useQuery({
      queryKey: ['enrolledStudents'],
      queryFn: () => getEnrolledStudents(),
   });

   // Mutations
   const approveMutation = useMutation({
      mutationFn: ({
         requestId,
         durationDays,
      }: {
         requestId: string;
         durationDays: number;
      }) => approveEnrollmentRequest(requestId, durationDays),
      onSuccess: () => {
         toast.success('Request approved! Access code sent to student.');
         queryClient.invalidateQueries({ queryKey: ['enrollmentRequests'] });
         setApprovalModal({ isOpen: false, request: null });
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Failed to approve');
      },
   });

   const rejectMutation = useMutation({
      mutationFn: rejectEnrollmentRequest,
      onSuccess: () => {
         toast.success('Request rejected. Student has been notified.');
         queryClient.invalidateQueries({ queryKey: ['enrollmentRequests'] });
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Failed to reject');
      },
   });

   const removeMutation = useMutation({
      mutationFn: ({
         courseId,
         studentId,
      }: {
         courseId: string;
         studentId: string;
      }) => removeStudentFromCourse(courseId, studentId),
      onSuccess: () => {
         toast.success('Student removed from course.');
         queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] });
         setRemoveModal({ isOpen: false, student: null });
      },
      onError: (error: any) => {
         toast.error(error?.response?.data?.message || 'Failed to remove');
      },
   });

   const requests = requestsData?.data || [];
   const students = studentsData?.data || [];

   // Filter and sort requests
   const filteredRequests = useMemo(() => {
      let filtered = [...requests];

      // Search filter
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         filtered = filtered.filter(
            (req) =>
               req.student.firstname.toLowerCase().includes(query) ||
               req.student.lastname.toLowerCase().includes(query) ||
               req.student.email.toLowerCase().includes(query) ||
               req.course.basicInfo.title.toLowerCase().includes(query)
         );
      }

      // Sort by date
      filtered.sort((a, b) => {
         const dateA = new Date(a.createdAt).getTime();
         const dateB = new Date(b.createdAt).getTime();
         return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      return filtered;
   }, [requests, searchQuery, sortOrder]);

   // Filter and sort students
   const filteredStudents = useMemo(() => {
      let filtered = [...students];

      // Search filter
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         filtered = filtered.filter(
            (enr) =>
               enr.student.firstname.toLowerCase().includes(query) ||
               enr.student.lastname.toLowerCase().includes(query) ||
               enr.student.email.toLowerCase().includes(query) ||
               enr.course.basicInfo.title.toLowerCase().includes(query)
         );
      }

      // Sort by date
      filtered.sort((a, b) => {
         const dateA = new Date(a.createdAt).getTime();
         const dateB = new Date(b.createdAt).getTime();
         return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });

      return filtered;
   }, [students, searchQuery, sortOrder]);

   return (
      <div className="p-6 md:p-8 bg-[#F5F7FA] min-h-screen font-sans">
         {/* Page Header */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
               <UserPlus className="w-7 h-7 text-orange-500" />
               Enrollment Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
               Manage enrollment requests and enrolled students
            </p>
         </div>

         {/* Search and Filter Bar */}
         <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, email, or course..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
               />
            </div>

            {/* Sort Toggle */}
            <button
               onClick={() =>
                  setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
               }
               className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
               {sortOrder === 'newest' ? (
                  <>
                     <ArrowDown className="w-4 h-4" />
                     Newest First
                  </>
               ) : (
                  <>
                     <ArrowUp className="w-4 h-4" />
                     Oldest First
                  </>
               )}
            </button>
         </div>

         <Tabs defaultValue="requests" className="w-full">
            <TabsList className="w-full max-w-md mb-6 bg-white border border-gray-200 p-1 rounded-lg">
               <TabsTrigger
                  value="requests"
                  className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md"
               >
                  <Clock className="w-4 h-4 mr-2" />
                  Pending ({filteredRequests.length})
               </TabsTrigger>
               <TabsTrigger
                  value="students"
                  className="flex-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md"
               >
                  <Users className="w-4 h-4 mr-2" />
                  Enrolled ({filteredStudents.length})
               </TabsTrigger>
            </TabsList>

            {/* Pending Requests Tab */}
            <TabsContent value="requests">
               {requestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  </div>
               ) : filteredRequests.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                     <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-gray-700">
                        {searchQuery
                           ? 'No matching requests'
                           : 'No Pending Requests'}
                     </h3>
                     <p className="text-gray-500 text-sm mt-1">
                        {searchQuery
                           ? 'Try a different search term'
                           : 'All enrollment requests have been processed'}
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-4">
                     {filteredRequests.map((request) => (
                        <div
                           key={request._id}
                           className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow"
                        >
                           {/* Student Info - Clickable */}
                           <Link
                              href={`/dashboard/instructor/students/${request.student._id}`}
                              className="flex items-center gap-4 flex-1 group cursor-pointer"
                           >
                              <Avatar className="w-12 h-12 border-2 border-gray-100 group-hover:border-orange-300 transition-colors">
                                 <AvatarImage src={request.student.avatar} />
                                 <AvatarFallback className="bg-orange-100 text-orange-600">
                                    {request.student.firstname?.charAt(0)}
                                    {request.student.lastname?.charAt(0)}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    {request.student.firstname}{' '}
                                    {request.student.lastname}
                                 </h4>
                                 <p className="text-sm text-gray-500">
                                    {request.student.email}
                                 </p>
                              </div>
                           </Link>

                           {/* Course Info */}
                           <div className="flex items-center gap-3 flex-1">
                              <BookOpen className="w-5 h-5 text-orange-500" />
                              <span className="text-gray-700 font-medium">
                                 {request.course.basicInfo.title}
                              </span>
                           </div>

                           {/* Time */}
                           <div className="text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                           </div>

                           {/* Actions */}
                           <div className="flex gap-2">
                              <button
                                 onClick={() =>
                                    setApprovalModal({
                                       isOpen: true,
                                       request,
                                    })
                                 }
                                 className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                 <Check className="w-4 h-4" />
                                 Approve
                              </button>
                              <button
                                 onClick={() =>
                                    rejectMutation.mutate(request._id)
                                 }
                                 disabled={rejectMutation.isPending}
                                 className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                 {rejectMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                 ) : (
                                    <X className="w-4 h-4" />
                                 )}
                                 Reject
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Enrolled Students Tab */}
            <TabsContent value="students">
               {studentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  </div>
               ) : filteredStudents.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                     <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-gray-700">
                        {searchQuery
                           ? 'No matching students'
                           : 'No Enrolled Students'}
                     </h3>
                     <p className="text-gray-500 text-sm mt-1">
                        {searchQuery
                           ? 'Try a different search term'
                           : 'Students will appear here once they enroll'}
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-4">
                     {filteredStudents.map((enrollment) => (
                        <div
                           key={enrollment._id}
                           className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow"
                        >
                           {/* Student Info - Clickable */}
                           <Link
                              href={`/dashboard/instructor/students/${enrollment.student._id}`}
                              className="flex items-center gap-4 flex-1 group cursor-pointer"
                           >
                              <Avatar className="w-12 h-12 border-2 border-gray-100 group-hover:border-blue-300 transition-colors">
                                 <AvatarImage src={enrollment.student.avatar} />
                                 <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {enrollment.student.firstname?.charAt(0)}
                                    {enrollment.student.lastname?.charAt(0)}
                                 </AvatarFallback>
                              </Avatar>
                              <div>
                                 <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {enrollment.student.firstname}{' '}
                                    {enrollment.student.lastname}
                                 </h4>
                                 <p className="text-sm text-gray-500">
                                    {enrollment.student.email}
                                 </p>
                              </div>
                           </Link>

                           {/* Course Info */}
                           <div className="flex items-center gap-3 flex-1">
                              <BookOpen className="w-5 h-5 text-orange-500" />
                              <span className="text-gray-700 font-medium">
                                 {enrollment.course.basicInfo.title}
                              </span>
                           </div>

                           {/* Progress */}
                           <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{
                                       width: `${enrollment.progress || 0}%`,
                                    }}
                                 />
                              </div>
                              <span className="text-sm text-gray-600">
                                 {enrollment.progress || 0}%
                              </span>
                           </div>

                           {/* Enrolled Date */}
                           <div className="text-sm text-gray-500">
                              {new Date(
                                 enrollment.createdAt
                              ).toLocaleDateString()}
                           </div>

                           {/* Remove Button */}
                           <button
                              onClick={() =>
                                 setRemoveModal({
                                    isOpen: true,
                                    student: enrollment,
                                 })
                              }
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium"
                           >
                              <Trash2 className="w-4 h-4" />
                              Remove
                           </button>
                        </div>
                     ))}
                  </div>
               )}
            </TabsContent>
         </Tabs>

         {/* Approval Modal */}
         <ApprovalModal
            isOpen={approvalModal.isOpen}
            onClose={() => setApprovalModal({ isOpen: false, request: null })}
            onApprove={(durationDays) => {
               if (approvalModal.request) {
                  approveMutation.mutate({
                     requestId: approvalModal.request._id,
                     durationDays,
                  });
               }
            }}
            studentName={`${approvalModal.request?.student.firstname || ''} ${approvalModal.request?.student.lastname || ''}`}
            courseName={approvalModal.request?.course.basicInfo.title || ''}
            isLoading={approveMutation.isPending}
         />

         {/* Remove Modal */}
         <RemoveModal
            isOpen={removeModal.isOpen}
            onClose={() => setRemoveModal({ isOpen: false, student: null })}
            onConfirm={() => {
               if (removeModal.student) {
                  removeMutation.mutate({
                     courseId: removeModal.student.course._id,
                     studentId: removeModal.student.student._id,
                  });
               }
            }}
            studentName={`${removeModal.student?.student.firstname || ''} ${removeModal.student?.student.lastname || ''}`}
            courseName={removeModal.student?.course.basicInfo.title || ''}
            isLoading={removeMutation.isPending}
         />
      </div>
   );
}
