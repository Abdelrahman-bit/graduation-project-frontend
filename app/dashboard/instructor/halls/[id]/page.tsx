'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getHallDetails,
   createBooking,
   cancelBooking,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
   Loader2,
   ArrowLeft,
   Users,
   Banknote,
   Calendar,
   CheckCircle,
} from 'lucide-react';
import CalendarComponent from '@/components/global/CalendarComponent';
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
import { format } from 'date-fns';
import { getMyCourses } from '@/app/services/instructorService';
import useStore from '@/app/store/useStore';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';

export default function InstructorHallBookingPage() {
   const params = useParams();
   const router = useRouter();
   const { id } = params;
   const queryClient = useQueryClient();
   const { user } = useStore();

   const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
   const [selectedCourseId, setSelectedCourseId] = useState<string>('');
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [isCancelOpen, setIsCancelOpen] = useState(false);

   const {
      data: hall,
      isLoading,
      error,
   } = useQuery({
      queryKey: ['hall', id],
      queryFn: () => getHallDetails(id as string),
      enabled: !!id,
   });

   const { data: courses = [] } = useQuery({
      queryKey: ['my-courses'],
      queryFn: getMyCourses,
   });

   const publishedCourses = courses.filter(
      (c: any) => c.status === 'published'
   );

   const bookingMutation = useMutation({
      mutationFn: createBooking,
      onSuccess: () => {
         toast.success('Booking confirmed successfully!');
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         setIsConfirmOpen(false);
         setSelectedSlot(null);
         setSelectedCourseId('');
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to book slot');
         setIsConfirmOpen(false);
      },
   });

   const cancelMutation = useMutation({
      mutationFn: cancelBooking,
      onSuccess: () => {
         toast.success('Booking cancelled successfully.');
         queryClient.invalidateQueries({ queryKey: ['hall', id] });
         setIsCancelOpen(false);
         setSelectedSlot(null);
      },
      onError: (err: any) => {
         toast.error(err.response?.data?.message || 'Failed to cancel booking');
         setIsCancelOpen(false);
      },
   });

   if (isLoading)
      return (
         <div className="flex h-[50vh] justify-center items-center">
            <Loader2 className="animate-spin" />
         </div>
      );
   if (error || !hall)
      return (
         <div className="text-center p-10 text-red-500">
            Failed to load hall.
         </div>
      );

   const handleSlotClick = (slot: any) => {
      if (slot.isBooked) {
         // Check ownership
         if (slot.bookedBy === user?._id || slot.bookedBy?._id === user?._id) {
            setSelectedSlot(slot);
            setIsCancelOpen(true);
         } else {
            toast.error('This slot is already booked by another instructor.');
         }
         return;
      }

      if (publishedCourses.length === 0) {
         toast.error('You need at least one published course to book a hall.');
         return;
      }

      setSelectedSlot(slot);
      setIsConfirmOpen(true);
   };

   const handleConfirmBooking = () => {
      if (!selectedSlot) return;
      if (!selectedCourseId) {
         toast.error('Please select a course for this booking');
         return;
      }
      bookingMutation.mutate({
         hall: hall._id,
         slot: selectedSlot._id,
         course: selectedCourseId,
      });
   };

   const handleConfirmCancel = () => {
      if (!selectedSlot || !selectedSlot.bookingId) return;
      cancelMutation.mutate(selectedSlot.bookingId);
   };

   const slots = Array.isArray(hall.availability) ? hall.availability : [];

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
               <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold">{hall.name}</h1>
               <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                     <Users size={14} /> {hall.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                     <Banknote size={14} />{' '}
                     {hall.pricePerHour || (hall as any).hourlyPrice} EGP/hr
                  </span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                     <Calendar size={18} /> Select a Slot
                  </h2>
                  <CalendarComponent
                     slots={slots}
                     role="instructor"
                     onSlotClick={handleSlotClick}
                  />
               </div>
            </div>

            <div className="lg:col-span-1">
               <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl sticky top-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                     Booking Instructions
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                     <li>Green slots are available for booking.</li>
                     <li>Red slots are booked (Click your own to cancel).</li>
                     <li>Click a slot to reserve it instantly.</li>
                     <li>Cancellations notify students automatically.</li>
                  </ul>
               </div>
            </div>
         </div>

         {/* Booking Dialog */}
         <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                     <div>
                        You are about to book <strong>{hall.name}</strong> for:
                        <br />
                        <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-800 font-medium text-center border">
                           {selectedSlot && (
                              <>
                                 {format(
                                    new Date(selectedSlot.startTime),
                                    'EEEE, MMMM d'
                                 )}
                                 <br />
                                 {format(
                                    new Date(selectedSlot.startTime),
                                    'h:mm a'
                                 )}{' '}
                                 -{' '}
                                 {format(
                                    new Date(selectedSlot.endTime),
                                    'h:mm a'
                                 )}
                              </>
                           )}
                        </div>
                        <div className="mt-4">
                           <label className="text-sm font-medium text-gray-700 mb-1 block text-left">
                              Select Course for this Session:
                           </label>
                           <Select
                              value={selectedCourseId}
                              onValueChange={setSelectedCourseId}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Select a course..." />
                              </SelectTrigger>
                              <SelectContent>
                                 {publishedCourses.map((course: any) => (
                                    <SelectItem
                                       key={course._id}
                                       value={course._id}
                                    >
                                       {course.basicInfo.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleConfirmBooking}
                     disabled={bookingMutation.isPending}
                  >
                     {bookingMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     Confirm Booking
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         {/* Cancellation Dialog */}
         <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                     Cancel Booking?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to cancel this booking?
                     <br />
                     <br />
                     <strong>This action cannot be undone.</strong>
                     <br />
                     All enrolled students will be automatically notified that
                     the class is cancelled.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleConfirmCancel}
                     disabled={cancelMutation.isPending}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     {cancelMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     Yes, Cancel Class
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
