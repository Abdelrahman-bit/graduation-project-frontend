'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   searchInstructors,
   deleteInstructor,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
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
   Mail,
   BookOpen,
   Calendar,
   Loader2,
   Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useDebounce } from 'use-debounce';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/app/components/global/ConfirmationModal';
import Image from 'next/image';

const InstructorsTab = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [debouncedSearch] = useDebounce(searchTerm, 500);
   const queryClient = useQueryClient();
   const [userToDelete, setUserToDelete] = useState<{
      id: string;
      name: string;
   } | null>(null);
   const router = useRouter();

   const { data: instructors, isLoading } = useQuery({
      queryKey: ['instructors', debouncedSearch],
      queryFn: () => searchInstructors(debouncedSearch),
   });

   const deleteMutation = useMutation({
      mutationFn: deleteInstructor,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['instructors'] });
         toast.success('Instructor removed successfully');
         setUserToDelete(null);
      },
      onError: (err) => {
         toast.error('Failed to remove instructor');
      },
   });

   const handleDeleteClick = (
      e: React.MouseEvent,
      id: string,
      name: string
   ) => {
      e.stopPropagation(); // Prevent row click
      setUserToDelete({ id, name });
   };

   const handleRowClick = (id: string) => {
      router.push(`/dashboard/admin/instructors/${id}`);
   };

   return (
      <div className="space-y-4">
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
                        <TableHead>Instructor</TableHead>
                        <TableHead>Courses</TableHead>
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
                     ) : !instructors || instructors.length === 0 ? (
                        <TableRow>
                           <TableCell colSpan={4} className="h-48 text-center">
                              <p className="text-muted-foreground">
                                 No instructors found.
                              </p>
                           </TableCell>
                        </TableRow>
                     ) : (
                        instructors.map((instructor) => (
                           <TableRow
                              key={instructor._id}
                              className="cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleRowClick(instructor._id)}
                           >
                              <TableCell>
                                 <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 relative">
                                       {instructor.avatar ? (
                                          <Image
                                             src={instructor.avatar}
                                             alt={instructor.firstname}
                                             fill
                                             className="object-cover"
                                          />
                                       ) : (
                                          <span className="text-blue-600 font-bold uppercase">
                                             {instructor.firstname?.charAt(0) ||
                                                'U'}
                                          </span>
                                       )}
                                    </div>
                                    <div>
                                       <div className="font-semibold text-gray-900">
                                          {instructor.firstname}{' '}
                                          {instructor.lastname}
                                       </div>
                                       <div className="text-xs text-gray-500 flex items-center gap-1">
                                          <Mail className="h-3 w-3" />
                                          {instructor.email}
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-700">
                                       {instructor.courses?.length || 0}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                       Active Courses
                                    </span>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(
                                       instructor.createdAt
                                    ).toLocaleDateString()}
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 <div className="flex justify-end items-center gap-2">
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                       title="Delete Instructor"
                                       onClick={(e) =>
                                          handleDeleteClick(
                                             e,
                                             instructor._id,
                                             `${instructor.firstname} ${instructor.lastname}`
                                          )
                                       }
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </div>
         </div>

         <ConfirmationModal
            isOpen={!!userToDelete}
            onClose={() => setUserToDelete(null)}
            onConfirm={() =>
               userToDelete && deleteMutation.mutate(userToDelete.id)
            }
            title="Delete Instructor"
            message={`Are you sure you want to delete ${userToDelete?.name}? This will remove their account and all associated data. This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
            isLoading={deleteMutation.isPending}
         />
      </div>
   );
};

export default InstructorsTab;
