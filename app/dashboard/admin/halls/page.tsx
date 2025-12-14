'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getHalls,
   createHall,
   updateHall,
   deleteHall,
   Hall,
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
import {
   Loader2,
   MoreHorizontal,
   Plus,
   Pencil,
   Trash2,
   MapPin,
   Users,
   Banknote,
} from 'lucide-react';
import { HallFormModal } from './components/HallFormModal';
import { toast } from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

export default function HallsPage() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingHall, setEditingHall] = useState<Hall | null>(null);
   const [deletingHallId, setDeletingHallId] = useState<string | null>(null);
   const queryClient = useQueryClient();

   const { data: halls, isLoading } = useQuery({
      queryKey: ['halls'],
      queryFn: getHalls,
   });

   const createmutation = useMutation({
      mutationFn: createHall,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['halls'] });
         setIsModalOpen(false);
         toast.success('Hall created successfully');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to create hall');
      },
   });

   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
         updateHall(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['halls'] });
         setIsModalOpen(false);
         setEditingHall(null);
         toast.success('Hall updated successfully');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to update hall');
      },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteHall,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['halls'] });
         setDeletingHallId(null);
         toast.success('Hall deleted successfully');
      },
      onError: () => {
         toast.error('Failed to delete hall');
      },
   });

   const handleCreate = (data: any) => {
      createmutation.mutate(data);
   };

   const handleUpdate = (data: any) => {
      if (editingHall) {
         updateMutation.mutate({ id: editingHall._id, data });
      }
   };

   const handleEditClick = (hall: Hall) => {
      // Need to map backend structure to Frontend expectations if needed
      // Assuming Hall type and backend match close enough for now
      setEditingHall(hall);
      setIsModalOpen(true);
   };

   const handleDeleteClick = (id: string) => {
      setDeletingHallId(id);
   };

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Halls Management
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                  Manage physical halls, labs, and rooms.
               </p>
            </div>
            <Button
               onClick={() => {
                  setEditingHall(null);
                  setIsModalOpen(true);
               }}
            >
               <Plus className="mr-2 h-4 w-4" />
               Add New Hall
            </Button>
         </div>

         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <Table>
               <TableHeader>
                  <TableRow className="bg-gray-50">
                     <TableHead>Hall Name</TableHead>
                     <TableHead>Capacity</TableHead>
                     <TableHead>Hourly Rate</TableHead>
                     <TableHead>Facilities</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
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
                  ) : !halls || halls.length === 0 ? (
                     <TableRow>
                        <TableCell
                           colSpan={5}
                           className="h-48 text-center text-gray-500"
                        >
                           No halls found. Create one to get started.
                        </TableCell>
                     </TableRow>
                  ) : (
                     halls.map((hall) => (
                        <TableRow key={hall._id}>
                           <TableCell className="font-medium">
                              {hall.name}
                              {/* <div className="text-xs text-gray-400 font-normal line-clamp-1">{hall.description || 'No description'}</div> */}
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2 text-gray-600">
                                 <Users size={14} />
                                 {hall.capacity}
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2 text-gray-600">
                                 <Banknote size={14} />
                                 {(hall.pricePerHour ||
                                    (hall as any).hourlyPrice) === 0
                                    ? 'Free'
                                    : `${hall.pricePerHour || (hall as any).hourlyPrice} EGP`}
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex flex-wrap gap-1">
                                 {/* Handle Facilities Rendering. Since backend returns object, we need to parse it if we want badges */}
                                 {/* For simplicity now, just count of active facilities or a simple text */}
                                 {hall.facilities &&
                                 typeof hall.facilities === 'object' &&
                                 !Array.isArray(hall.facilities) ? (
                                    Object.entries(hall.facilities)
                                       // @ts-ignore
                                       .filter(([_, val]) => val === true)
                                       .slice(0, 3)
                                       .map(([key]) => (
                                          <Badge
                                             key={key}
                                             variant="secondary"
                                             className="text-[10px] px-1 py-0 h-5"
                                          >
                                             {key.replace('has', '')}
                                          </Badge>
                                       ))
                                 ) : (
                                    <span className="text-xs text-gray-400">
                                       N/A
                                    </span>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell className="text-right">
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
                                       onClick={() => handleEditClick(hall)}
                                    >
                                       <Pencil className="mr-2 h-4 w-4" />
                                       Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                       <a
                                          href={`/dashboard/admin/halls/${hall._id}`}
                                          className="cursor-pointer"
                                       >
                                          <MapPin className="mr-2 h-4 w-4" />
                                          View Details
                                       </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       className="text-red-600"
                                       onClick={() =>
                                          handleDeleteClick(hall._id)
                                       }
                                    >
                                       <Trash2 className="mr-2 h-4 w-4" />
                                       Delete
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         <HallFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={editingHall ? handleUpdate : handleCreate}
            initialData={editingHall}
            isLoading={createmutation.isPending || updateMutation.isPending}
         />

         <AlertDialog
            open={!!deletingHallId}
            onOpenChange={() => setDeletingHallId(null)}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action will soft-delete the hall, making it
                     unavailable for future bookings.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => deleteMutation.mutate(deletingHallId!)}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     Delete
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
