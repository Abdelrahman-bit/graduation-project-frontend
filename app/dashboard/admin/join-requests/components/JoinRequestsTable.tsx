'use client';

import React from 'react';
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

const JoinRequestsTable = () => {
   const queryClient = useQueryClient();

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
         toast.success('Request updated successfully');
      },
      onError: () => {
         toast.error('Failed to update request');
      },
   });

   // Track the ID of the request being processed
   const [processingId, setProcessingId] = React.useState<string | null>(null);

   const handleAction = (id: string, status: 'approved' | 'rejected') => {
      setProcessingId(id);
      mutation.mutate(
         { id, status },
         {
            onSettled: () => setProcessingId(null),
         }
      );
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
         <div className="p-5 border-b bg-gray-50/50">
            <h2 className="font-semibold text-lg text-gray-800">
               Pending Requests
            </h2>
            <p className="text-sm text-gray-500">
               Manage instructor join applications
            </p>
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
                              <p className="text-sm">
                                 All caught up! There are no new applications.
                              </p>
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
                                    {request.name.charAt(0).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">
                                       {request.name}
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
                                 <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                    {request.phone}
                                 </div>
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
                                       handleAction(request._id, 'rejected')
                                    }
                                    disabled={processingId === request._id}
                                    title="Reject Application"
                                 >
                                    {processingId === request._id &&
                                    mutation.variables?.status ===
                                       'rejected' ? (
                                       <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                       <X className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Reject</span>
                                 </Button>

                                 <Button
                                    size="sm"
                                    className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white border-green-600"
                                    onClick={() =>
                                       handleAction(request._id, 'approved')
                                    }
                                    disabled={processingId === request._id}
                                    title="Approve Application"
                                 >
                                    {processingId === request._id &&
                                    mutation.variables?.status ===
                                       'approved' ? (
                                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                       <Check className="h-4 w-4 mr-1.5" />
                                    )}
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

         {/* Footer / Pagination Area (Optional) */}
         <div className="p-4 border-t bg-gray-50/50 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {joinRequests?.length || 0} requests</span>
         </div>
      </div>
   );
};

export default JoinRequestsTable;
