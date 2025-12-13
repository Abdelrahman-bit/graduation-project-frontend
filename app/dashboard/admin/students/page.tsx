'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchStudents, deleteStudent } from '@/app/services/adminService';
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
   Mail,
   Phone,
   Calendar,
   Loader2,
   User,
   Trash2,
   Eye,
} from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const StudentsPage = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [debouncedSearch] = useDebounce(searchTerm, 500);
   const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
   const router = useRouter();
   const queryClient = useQueryClient();

   const { data: students, isLoading } = useQuery({
      queryKey: ['students', debouncedSearch],
      queryFn: () => searchStudents(debouncedSearch),
   });

   const deleteMutation = useMutation({
      mutationFn: deleteStudent,
      onSuccess: () => {
         toast.success('Student deleted successfully');
         queryClient.invalidateQueries({ queryKey: ['students'] });
         setStudentToDelete(null);
      },
      onError: () => {
         toast.error('Failed to delete student');
         setStudentToDelete(null);
      },
   });

   const handleDeleteConfirm = () => {
      if (studentToDelete) {
         deleteMutation.mutate(studentToDelete);
      }
   };

   return (
      <div className="p-6 space-y-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">
               Students Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
               Overview of enrolled students.
            </p>
         </div>

         {/* Tools Bar */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
            <div className="relative w-full sm:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>
         </div>

         {/* Table */}
         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead>Student</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center">
                              <div className="flex justify-center">
                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : !students || students.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center">
                              <div className="flex flex-col items-center justify-center text-gray-500">
                                 <div className="bg-gray-100 p-3 rounded-full mb-3">
                                    <User className="h-6 w-6 text-gray-400" />
                                 </div>
                                 <p className="font-medium">
                                    No students found
                                 </p>
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        students.map((student) => (
                           <TableRow
                              key={student._id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/admin/students/${student._id}`
                                 )
                              }
                           >
                              <TableCell>
                                 <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold uppercase overflow-hidden relative border border-gray-100">
                                       {student.avatar ? (
                                          <Image
                                             src={student.avatar}
                                             alt={student.firstname}
                                             fill
                                             className="object-cover"
                                          />
                                       ) : (
                                          student.firstname?.charAt(0) || 'U'
                                       )}
                                    </div>
                                    <div>
                                       <div className="font-semibold text-gray-900">
                                          {student.firstname} {student.lastname}
                                       </div>
                                       <div className="text-xs text-gray-500">
                                          Student
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex flex-col gap-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                       <Mail className="h-3.5 w-3.5 text-gray-400" />
                                       {student.email}
                                    </div>
                                    {student.phone && (
                                       <div className="flex items-center gap-2">
                                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                                          {student.phone}
                                       </div>
                                    )}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(
                                       student.createdAt
                                    ).toLocaleDateString()}
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 <div
                                    className="flex items-center justify-end"
                                    onClick={(e) => e.stopPropagation()} // Prevent row click
                                 >
                                    <DropdownMenu>
                                       <DropdownMenuTrigger asChild>
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             className="h-8 w-8 p-0"
                                          >
                                             <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                       </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                             onClick={() =>
                                                router.push(
                                                   `/dashboard/admin/students/${student._id}`
                                                )
                                             }
                                          >
                                             <Eye className="mr-2 h-4 w-4" />
                                             View Profile
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                             className="text-red-600 focus:text-red-600"
                                             onClick={() =>
                                                setStudentToDelete(student._id)
                                             }
                                          >
                                             <Trash2 className="mr-2 h-4 w-4" />
                                             Delete Student
                                          </DropdownMenuItem>
                                       </DropdownMenuContent>
                                    </DropdownMenu>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </div>

         {/* Delete Confirmation Dialog */}
         <AlertDialog
            open={!!studentToDelete}
            onOpenChange={() => setStudentToDelete(null)}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete
                     the student account and remove their data from our servers.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleDeleteConfirm}
                     className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                     {deleteMutation.isPending
                        ? 'Deleting...'
                        : 'Delete Student'}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
};

export default StudentsPage;
