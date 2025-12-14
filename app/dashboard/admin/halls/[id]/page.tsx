'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getHallDetails,
   updateSlot,
   deleteSlot,
   deleteSlotsByDate,
   updateHall,
   createSlot,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Users, Banknote, MapPin, Ban } from 'lucide-react';
import CalendarComponent from '@/components/global/CalendarComponent';
import { SlotAddModal } from '../components/SlotAddModal';
import { BlockDateModal } from '../components/BlockDateModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { toast } from 'react-hot-toast';

export default function HallDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const { id } = params;
   const queryClient = useQueryClient();

   const [selectedSlot, setSelectedSlot] = React.useState<any>(null);
   const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
   const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
   const [isBlockDateModalOpen, setIsBlockDateModalOpen] =
      React.useState(false);
   const [selectedDateForAdd, setSelectedDateForAdd] =
      React.useState<Date | null>(null);

   const {
      data: hall,
      isLoading,
      error,
   } = useQuery({
      queryKey: ['hall', id],
      queryFn: () => getHallDetails(id as string),
      enabled: !!id,
   });

   const createSlotMutation = useMutation({
      mutationFn: ({
         startTime,
         endTime,
      }: {
         startTime: string;
         endTime: string;
      }) => createSlot(id as string, { startTime, endTime }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         setIsAddModalOpen(false);
         toast.success('Slot added successfully');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to add slot');
      },
   });

   const updateHallMutation = useMutation({
      mutationFn: (data: any) => updateHall(id as string, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         toast.success('Hall settings updated');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to update hall');
      },
   });

   const deleteSlotMutation = useMutation({
      mutationFn: (slotId: string) => deleteSlot(slotId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         setIsDeleteAlertOpen(false);
         setSelectedSlot(null);
         toast.success('Slot deleted successfully');
      },
      onError: (err: any) => {
         toast.error('Failed to delete slot');
      },
   });

   const blockDateMutation = useMutation({
      mutationFn: (date: string) => deleteSlotsByDate(id as string, date),
      onSuccess: (data: any) => {
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         setIsBlockDateModalOpen(false);
         toast.success(data.message || 'Date blocked successfully');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to block date');
      },
   });

   if (isLoading) {
      return (
         <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   if (error || !hall) {
      return (
         <div className="flex flex-col h-[50vh] items-center justify-center space-y-4">
            <p className="text-red-500">Failed to load hall details.</p>
            <Button variant="outline" onClick={() => router.back()}>
               Go Back
            </Button>
         </div>
      );
   }

   // Prepare slots for Calendar (handling population from backend)
   // Assuming backend 'getHallDetails' populates 'availability' with Slot objects
   const slots = Array.isArray(hall.availability) ? hall.availability : [];

   const handleSlotClick = (slot: any) => {
      setSelectedSlot(slot);
      setIsDeleteAlertOpen(true);
   };

   const handleEmptySlotClick = (date: Date) => {
      setSelectedDateForAdd(date);
      setIsAddModalOpen(true);
   };

   const isMaintenance = hall.isBookable === false;

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         {/* ... Header and Info Card ... */}
         <div className="flex items-center gap-4">
            <Button
               variant="ghost"
               size="icon"
               onClick={() => router.back()}
               className="h-8 w-8"
            >
               <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold text-gray-900">{hall.name}</h1>
               <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <MapPin size={14} />
                  <span>Hall Details</span>
                  {isMaintenance && (
                     <Badge variant="destructive" className="ml-2">
                        Maintenance Mode
                     </Badge>
                  )}
               </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
               <div className="flex items-center space-x-2 border-r pr-4 mr-0 border-gray-200">
                  <Switch
                     id="maintenance-mode"
                     checked={!hall.isBookable} // isBookable=false means Maintenance=true
                     onCheckedChange={(checked) =>
                        updateHallMutation.mutate({ isBookable: !checked })
                     }
                     disabled={updateHallMutation.isPending}
                  />
                  <Label htmlFor="maintenance-mode" className="cursor-pointer">
                     Maintenance Mode
                  </Label>
               </div>

               <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBlockDateModalOpen(true)}
                  className="gap-2"
               >
                  <Ban className="h-4 w-4" />
                  Block Date
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info Card */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-semibold text-gray-900">Information</h3>

                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2">
                           <Users size={16} /> Capacity
                        </span>
                        <span className="font-medium text-gray-900">
                           {hall.capacity} People
                        </span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2">
                           <Banknote size={16} /> Hourly Rate
                        </span>
                        <span className="font-medium text-gray-900">
                           {(hall.pricePerHour || (hall as any).hourlyPrice) ===
                           0
                              ? 'Free'
                              : `${hall.pricePerHour || (hall as any).hourlyPrice} EGP`}
                        </span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                     <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Facilities
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {hall.facilities &&
                        typeof hall.facilities === 'object' ? (
                           Object.entries(hall.facilities)
                              // @ts-ignore
                              .filter(([_, val]) => val === true)
                              .map(([key]) => (
                                 <Badge
                                    key={key}
                                    variant="secondary"
                                    className="text-xs"
                                 >
                                    {key.replace('has', '')}
                                 </Badge>
                              ))
                        ) : (
                           <span className="text-sm text-gray-400">
                              None listed
                           </span>
                        )}
                     </div>
                  </div>

                  {hall.description && (
                     <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                           Description
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {hall.description}
                        </p>
                     </div>
                  )}
               </div>
            </div>

            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                     Availability Schedule
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                     <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Available
                     </span>
                     <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Booked
                     </span>
                  </div>
               </div>

               <CalendarComponent
                  slots={slots}
                  role="admin" // Allowing admin to see and manage
                  onSlotClick={handleSlotClick}
                  onEmptySlotClick={handleEmptySlotClick}
               />
            </div>
         </div>

         {/* Modals */}
         <SlotAddModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(startTime, endTime) =>
               createSlotMutation.mutate({ startTime, endTime })
            }
            date={selectedDateForAdd}
            isLoading={createSlotMutation.isPending}
         />

         <AlertDialog
            open={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
         >
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete Slot?</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this available slot? This
                     action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     className="bg-red-600 hover:bg-red-700"
                     onClick={() =>
                        selectedSlot &&
                        deleteSlotMutation.mutate(selectedSlot._id)
                     }
                  >
                     {deleteSlotMutation.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         <BlockDateModal
            isOpen={isBlockDateModalOpen}
            onClose={() => setIsBlockDateModalOpen(false)}
            onConfirm={(date) => blockDateMutation.mutate(date)}
            isLoading={blockDateMutation.isPending}
         />
      </div>
   );
}
