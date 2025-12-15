'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getBookings,
   updateBookingStatus,
   deleteBooking,
   createBooking,
   updateBookingDetails,
   getHalls,
   Booking,
   Hall,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import {
   ChevronLeft,
   ChevronRight,
   Plus,
   Search,
   Users,
   Check,
   X,
   MoreHorizontal,
   MapPin,
   Loader2,
   Trash2,
   CalendarDays,
   Edit,
   Clock,
} from 'lucide-react';
import Image from 'next/image';

const BookingsManager = () => {
   const queryClient = useQueryClient();

   // --- States ---
   const [selectedDate, setSelectedDate] = useState(new Date());
   const [searchQuery, setSearchQuery] = useState('');
   const [viewMode, setViewMode] = useState<'List' | 'Day' | 'Week'>('List');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

   const formattedDate = selectedDate.toISOString().split('T')[0];

   // --- Queries ---

   // 1. Get Bookings
   const { data: bookings, isLoading: isLoadingBookings } = useQuery({
      queryKey: ['bookings', formattedDate, searchQuery],
      queryFn: () => getBookings(formattedDate, searchQuery),
   });

   // 2. Get Halls (For Dropdown)
   const { data: halls } = useQuery({
      queryKey: ['halls'],
      queryFn: getHalls,
   });

   // --- Mutations ---

   const statusMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
         updateBookingStatus(id, status),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['bookings'] });
         toast.success(`Booking ${variables.status}`);
      },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteBooking,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['bookings'] });
         toast.success('Booking deleted');
      },
   });

   const saveMutation = useMutation({
      mutationFn: (data: any) => {
         if (editingBooking)
            return updateBookingDetails(editingBooking.id, data);
         return createBooking(data);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['bookings'] });
         toast.success(editingBooking ? 'Booking updated' : 'Booking created');
         setIsModalOpen(false);
         setEditingBooking(null);
      },
      onError: (error: any) => {
         toast.error(error.message || 'Failed to save booking');
      },
   });

   // --- Handlers ---

   const handleDateChange = (days: number) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + days);
      setSelectedDate(newDate);
   };

   const openCreateModal = () => {
      setEditingBooking(null);
      setIsModalOpen(true);
   };

   const openEditModal = (booking: Booking) => {
      setEditingBooking(booking);
      setIsModalOpen(true);
   };

   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const hallId = formData.get('hallId') as string;

      // Get Hall Name from ID
      const selectedHall = halls?.find((h) => h.id === hallId);

      const payload = {
         title: formData.get('title') as string,
         date: formData.get('date') as string,
         startTime: formData.get('startTime') as string,
         endTime: formData.get('endTime') as string,
         hallId: hallId,
         hallName: selectedHall?.name || 'Unknown Hall',
         type: 'class', // Default type
      };

      saveMutation.mutate(payload);
   };

   // --- Styling ---
   const getTypeBorderColor = (type: string) => {
      switch (type) {
         case 'event':
            return 'border-l-[#FF6636]';
         case 'class':
            return 'border-l-[#23BD33]';
         case 'maintenance':
            return 'border-l-[#FD8E1F]';
         default:
            return 'border-l-gray-300';
      }
   };

   const getStatusBadgeStyles = (status: string) => {
      switch (status) {
         case 'approved':
            return 'bg-[#E1F7E3] text-[#23BD33]';
         case 'pending':
            return 'bg-[#FFF2E5] text-[#FF6636]';
         case 'rejected':
            return 'bg-[#FFEEE8] text-[#FF3B30]';
         default:
            return 'bg-gray-100 text-gray-600';
      }
   };

   return (
      <div className="space-y-8 font-sans">
         {/* Header Controls */}
         <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div className="flex items-center gap-4 sm:gap-6 w-full xl:w-auto justify-between xl:justify-start">
               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 min-w-[180px]">
                  {selectedDate.toLocaleDateString('en-US', {
                     weekday: 'short',
                     month: 'short',
                     day: 'numeric',
                  })}
               </h2>
               <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm select-none">
                  <button
                     onClick={() => handleDateChange(-1)}
                     className="p-1.5 hover:bg-gray-50 rounded text-gray-500 transition-colors active:scale-95"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button
                     onClick={() => setSelectedDate(new Date())}
                     className="px-4 py-1 text-sm font-semibold text-[#FF6636] bg-[#FFF2E5] rounded mx-1 hover:bg-[#ffeacc] transition-colors"
                  >
                     Today
                  </button>
                  <button
                     onClick={() => handleDateChange(1)}
                     className="p-1.5 hover:bg-gray-50 rounded text-gray-500 transition-colors active:scale-95"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto">
               <div className="relative flex-1 group">
                  <Search
                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6636] transition-colors"
                     size={18}
                  />
                  <Input
                     placeholder="Search bookings..."
                     className="pl-10 h-11 bg-white border-gray-200 focus:border-[#FF6636] focus:ring-[#FF6636] w-full rounded-lg"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>

               <div className="hidden md:flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                  {['List', 'Day', 'Week'].map((v) => (
                     <button
                        key={v}
                        onClick={() => setViewMode(v as any)}
                        className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${viewMode === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                     >
                        {v}
                     </button>
                  ))}
               </div>

               <Button
                  onClick={openCreateModal}
                  className="bg-[#FF6636] hover:bg-[#E55A2F] text-white gap-2 h-11 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
               >
                  <Plus size={20} /> Create
               </Button>
            </div>
         </div>

         {/* Bookings List */}
         <div className="space-y-4">
            {isLoadingBookings ? (
               <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <Loader2 className="animate-spin text-[#FF6636] w-8 h-8" />
                  <p className="text-gray-400 text-sm">Loading schedule...</p>
               </div>
            ) : !bookings || bookings.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                  <div className="bg-gray-50 p-4 rounded-full mb-3">
                     <CalendarDays className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                     No bookings found
                  </h3>
                  <p className="text-sm">
                     No events scheduled for{' '}
                     {searchQuery ? 'your search' : 'this date'}.
                  </p>
                  <Button
                     variant="link"
                     onClick={openCreateModal}
                     className="text-[#FF6636] mt-2"
                  >
                     Create new booking
                  </Button>
               </div>
            ) : (
               bookings.map((booking) => (
                  <div
                     key={booking.id}
                     className="flex flex-col md:flex-row gap-0 md:gap-8 group"
                  >
                     {/* Left: Time */}
                     <div className="w-full md:w-28 py-6 md:text-right shrink-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end border-b md:border-b-0 border-gray-100">
                        <span className="text-base font-bold text-gray-900">
                           {booking.startTime}
                        </span>
                        <span className="text-xs font-medium text-gray-400 mt-1">
                           {booking.endTime}
                        </span>
                     </div>

                     {/* Right: Card */}
                     <div
                        className={`flex-1 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border-l-[6px] ${getTypeBorderColor(booking.type)} flex flex-col xl:flex-row gap-6 xl:items-center justify-between relative`}
                     >
                        <div className="flex flex-col gap-3 flex-1">
                           <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-bold text-gray-900 text-lg">
                                 {booking.title}
                              </h3>
                              <span
                                 className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeStyles(booking.status)}`}
                              >
                                 {booking.status}
                              </span>
                           </div>

                           <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                 <MapPin size={16} className="text-gray-400" />
                                 {booking.hallName}
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-gray-100 border border-white shadow-sm overflow-hidden relative">
                                    {booking.instructorAvatar ? (
                                       <Image
                                          src={booking.instructorAvatar}
                                          alt={booking.instructorName}
                                          fill
                                          className="object-cover"
                                       />
                                    ) : (
                                       <div className="flex items-center justify-center h-full text-[10px] font-bold text-gray-500 bg-[#FFF2E5] text-[#FF6636]">
                                          {booking.instructorName.charAt(0)}
                                       </div>
                                    )}
                                 </div>
                                 <span className="text-xs font-semibold text-gray-700">
                                    {booking.instructorName}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Users size={16} className="text-gray-400" />
                                 <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {booking.attendees}/{booking.maxCapacity}
                                 </span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 xl:pt-0 border-t xl:border-t-0 border-gray-50">
                           {booking.status === 'pending' && (
                              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-md bg-white text-[#23BD33] border border-gray-200 hover:bg-[#E1F7E3]"
                                    onClick={() =>
                                       statusMutation.mutate({
                                          id: booking.id,
                                          status: 'approved',
                                       })
                                    }
                                 >
                                    <Check size={16} strokeWidth={3} />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-md bg-white text-[#FF3B30] border border-gray-200 hover:bg-[#FFEEE8]"
                                    onClick={() =>
                                       statusMutation.mutate({
                                          id: booking.id,
                                          status: 'rejected',
                                       })
                                    }
                                 >
                                    <X size={16} strokeWidth={3} />
                                 </Button>
                              </div>
                           )}
                           <div className="h-8 w-px bg-gray-200 hidden xl:block"></div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-[#FF6636] hover:bg-[#FFF2E5] rounded-lg"
                                 >
                                    <MoreHorizontal size={18} />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                 <DropdownMenuSeparator />
                                 <DropdownMenuItem
                                    onClick={() => openEditModal(booking)}
                                    className="cursor-pointer"
                                 >
                                    <Edit size={14} className="mr-2" /> Edit
                                    Details
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    onClick={() => {
                                       if (confirm('Delete?'))
                                          deleteMutation.mutate(booking.id);
                                    }}
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                 >
                                    <Trash2 size={14} className="mr-2" /> Delete
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* --- CREATE / EDIT MODAL --- */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-xl border-none">
               <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                     {editingBooking ? 'Edit Booking' : 'Create New Booking'}
                  </DialogTitle>
                  <DialogDescription>
                     {editingBooking
                        ? 'Modify details.'
                        : 'Schedule a new session manually.'}
                  </DialogDescription>
               </DialogHeader>
               <form onSubmit={handleFormSubmit} className="space-y-5 mt-4">
                  <div className="space-y-2">
                     <Label className="text-xs font-bold text-gray-500 uppercase">
                        Title
                     </Label>
                     <Input
                        name="title"
                        defaultValue={editingBooking?.title}
                        placeholder="e.g. Workshop Session"
                        className="focus:border-[#FF6636]"
                        required
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">
                           Date
                        </Label>
                        <div className="relative">
                           <Input
                              name="date"
                              type="date"
                              className="focus:border-[#FF6636] pl-9"
                              defaultValue={
                                 editingBooking?.date || formattedDate
                              }
                              required
                           />
                           <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                     </div>
                     {/* DYNAMIC HALL SELECTION */}
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">
                           Hall
                        </Label>
                        <Select
                           name="hallId"
                           defaultValue={
                              editingBooking?.hallId || halls?.[0]?.id
                           }
                        >
                           <SelectTrigger className="focus:ring-[#FF6636]">
                              <SelectValue placeholder="Select Hall" />
                           </SelectTrigger>
                           <SelectContent>
                              {halls?.map((hall: Hall) => (
                                 <SelectItem key={hall.id} value={hall.id}>
                                    {hall.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">
                           Start Time
                        </Label>
                        <div className="relative">
                           <Input
                              name="startTime"
                              type="time"
                              className="focus:border-[#FF6636] pl-9"
                              defaultValue={
                                 editingBooking?.startTime || '09:00'
                              }
                              required
                           />
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase">
                           End Time
                        </Label>
                        <div className="relative">
                           <Input
                              name="endTime"
                              type="time"
                              className="focus:border-[#FF6636] pl-9"
                              defaultValue={editingBooking?.endTime || '10:00'}
                              required
                           />
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                     </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        className="border-gray-200"
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        className="bg-[#FF6636] hover:bg-[#E55A2F] text-white"
                        disabled={saveMutation.isPending}
                     >
                        {saveMutation.isPending && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {editingBooking ? 'Save Changes' : 'Create Booking'}
                     </Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default BookingsManager;
