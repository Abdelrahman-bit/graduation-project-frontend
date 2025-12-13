'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getJoinRequests,
   updateJoinRequestStatus,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { toast } from 'react-hot-toast';
import { Check, X, User, Phone, Loader2, Mail } from 'lucide-react';
import ConfirmationModal from '@/app/components/global/ConfirmationModal';

const JoinRequestsTab = () => {
   const queryClient = useQueryClient();
   const [selectedRequest, setSelectedRequest] = useState<{
      id: string;
      status: 'approved' | 'rejected';
      name: string;
   } | null>(null);

   const { data: joinRequests, isLoading } = useQuery({
      queryKey: ['joinRequests'],
      queryFn: getJoinRequests,
   });

   const mutation = useMutation({
      mutationFn: ({
         id,
         status,
      }: {
         id: string;
         status: 'approved' | 'rejected';
      }) => updateJoinRequestStatus(id, status),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['joinRequests'] });
         toast.success(`Request ${selectedRequest?.status} successfully`);
         setSelectedRequest(null);
      },
      onError: () => {
         toast.error('Failed to update request');
      },
   });

   const handleActionClick = (
      id: string,
      status: 'approved' | 'rejected',
      name: string
   ) => {
      setSelectedRequest({ id, status, name });
   };

   const handleConfirmAction = () => {
      if (selectedRequest) {
         mutation.mutate({
            id: selectedRequest.id,
            status: selectedRequest.status,
         });
      }
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-64 bg-white rounded-lg border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
         <div className="p-5 border-b bg-gray-50/50 flex justify-between items-center">
            <div>
               <h2 className="font-semibold text-lg text-gray-800">
                  New Join Requests
               </h2>
               <p className="text-sm text-gray-500">
                  Review and approve new instructor applications
               </p>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
               {joinRequests?.length || 0} Pending
            </span>
         </div>

         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                     <TableHead className="w-[300px]">Instructor</TableHead>
                     <TableHead>Contact Info</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {!joinRequests || joinRequests.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={4} className="h-48 text-center">
                           <div className="flex flex-col items-center justify-center text-gray-500">
                              <div className="bg-gray-100 p-3 rounded-full mb-3">
                                 <User className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="font-medium">No pending requests</p>
                           </div>
                        </TableCell>
                     </TableRow>
                  ) : (
                     joinRequests.map((request) => (
                        <TableRow
                           key={request._id}
                           className="hover:bg-gray-50/50 transition-colors"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                                    {request.firstname.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">
                                       {`${request.firstname} ${request.lastname}`}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                       Applied recently
                                    </span>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex flex-col gap-1 text-sm text-gray-600">
                                 <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                                    {request.email}
                                 </div>
                                 {request.phone && (
                                    <div className="flex items-center gap-2">
                                       <Phone className="h-3.5 w-3.5 text-gray-400" />
                                       {request.phone}
                                    </div>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                 Pending
                              </span>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    onClick={() =>
                                       handleActionClick(
                                          request._id,
                                          'rejected',
                                          `${request.firstname} ${request.lastname}`
                                       )
                                    }
                                 >
                                    <X className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="sm"
                                    className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white border-green-600"
                                    onClick={() =>
                                       handleActionClick(
                                          request._id,
                                          'approved',
                                          `${request.firstname} ${request.lastname}`
                                       )
                                    }
                                 >
                                    <Check className="h-4 w-4 mr-1.5" />
                                    Approve
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         <ConfirmationModal
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onConfirm={handleConfirmAction}
            title={
               selectedRequest?.status === 'approved'
                  ? 'Approve Instructor'
                  : 'Reject Application'
            }
            message={
               selectedRequest?.status === 'approved'
                  ? `Are you sure you want to approve ${selectedRequest?.name}? They will be notified via email.`
                  : `Are you sure you want to reject ${selectedRequest?.name}? This action cannot be undone.`
            }
            confirmText={
               selectedRequest?.status === 'approved'
                  ? 'Approve Access'
                  : 'Reject Application'
            }
            variant={
               selectedRequest?.status === 'approved' ? 'primary' : 'danger'
            }
            isLoading={mutation.isPending}
         />
      </div>
   );
};

export default JoinRequestsTab;
