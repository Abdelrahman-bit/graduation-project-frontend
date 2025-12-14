'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHallStatus } from '@/app/services/adminService';
import {
   format,
   addDays,
   subDays,
   startOfDay,
   getHours,
   getMinutes,
} from 'date-fns';
import {
   Loader2,
   Calendar as CalendarIcon,
   ChevronLeft,
   ChevronRight,
   User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HallStatusPage() {
   const [date, setDate] = useState<Date>(new Date());
   const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
   const [isDetailsOpen, setIsDetailsOpen] = useState(false);

   const { data: hallsStatus, isLoading } = useQuery({
      queryKey: ['hallStatus', format(date, 'yyyy-MM-dd')],
      queryFn: () => getHallStatus(format(date, 'yyyy-MM-dd')),
   });

   const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
   const totalMinutes = 15 * 60; // 900 minutes

   // Helper to calculate position and width of a slot/booking in PERCENTAGE
   const getPositionStyle = (start: string, end: string) => {
      const startTime = new Date(start);
      const endTime = new Date(end);

      const startHour = getHours(startTime);
      const startMinute = getMinutes(startTime);
      const endHour = getHours(endTime);
      const endMinute = getMinutes(endTime);

      // Start relative to 8 AM
      const startOffsetMinutes = (startHour - 8) * 60 + startMinute;
      const durationMinutes =
         endHour * 60 + endMinute - (startHour * 60 + startMinute);

      const left = (startOffsetMinutes / totalMinutes) * 100;
      const width = (durationMinutes / totalMinutes) * 100;

      return { left: `${left}%`, width: `${width}%` };
   };

   return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
         <div className="flex items-center justify-between shrink-0">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Halls Timeline
               </h1>
               <p className="text-sm text-gray-500">View status of all halls</p>
            </div>

            <div className="flex items-center gap-2">
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(subDays(date, 1))}
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>

               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className={cn(
                           'w-[240px] justify-start text-left font-normal',
                           !date && 'text-muted-foreground'
                        )}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                     <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                     />
                  </PopoverContent>
               </Popover>

               <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDate(addDays(date, 1))}
               >
                  <ChevronRight className="h-4 w-4" />
               </Button>

               <Button onClick={() => setDate(new Date())}>Today</Button>
            </div>
         </div>

         {isLoading ? (
            <div className="flex h-full items-center justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
               {/* Header Row (Sticky Top) */}
               <div className="flex border-b border-gray-200 bg-gray-50 z-20 shrink-0">
                  <div className="w-48 shrink-0 p-4 font-semibold text-gray-700 border-r border-gray-200">
                     Hall Name
                  </div>
                  <div className="flex-1 grid grid-cols-[repeat(15,minmax(0,1fr))] divide-x divide-gray-200">
                     {hours.map((hour) => (
                        <div
                           key={hour}
                           className="text-xs text-center p-2 text-gray-500 font-medium"
                        >
                           {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Scrollable Body */}
               <div className="overflow-y-auto flex-1">
                  {hallsStatus && hallsStatus.length > 0 ? (
                     hallsStatus.map((hall: any) => (
                        <div
                           key={hall._id}
                           className="flex border-b border-gray-100 hover:bg-gray-50/30 transition-colors h-20"
                        >
                           <div className="w-48 shrink-0 p-4 font-medium text-gray-900 border-r border-gray-200 flex items-center bg-white z-10">
                              {hall.name}
                           </div>
                           <div className="flex-1 relative">
                              {/* Grid Background */}
                              <div className="absolute inset-0 grid grid-cols-[repeat(15,minmax(0,1fr))] divide-x divide-gray-100/50 pointer-events-none">
                                 {hours.map((h) => (
                                    <div key={h} className="h-full"></div>
                                 ))}
                              </div>

                              {/* Slots & Bookings */}
                              <div className="absolute inset-0 top-3 bottom-3">
                                 {/* Available Slots */}
                                 {hall.daySlots?.map((slot: any) => {
                                    const isBooked = hall.dayBookings?.some(
                                       (b: any) => b.slot === slot._id
                                    );
                                    if (isBooked) return null;

                                    const style = getPositionStyle(
                                       slot.startTime,
                                       slot.endTime
                                    );
                                    return (
                                       <div
                                          key={slot._id}
                                          className="absolute top-0 bottom-0 bg-green-100/80 border border-green-200 rounded-md flex items-center justify-center text-xs text-green-700 z-10 hover:bg-green-100 transition-colors cursor-default truncate px-1"
                                          style={style}
                                          title="Available Slot"
                                       >
                                          Available
                                       </div>
                                    );
                                 })}

                                 {/* Bookings */}
                                 {hall.dayBookings?.map((booking: any) => {
                                    const slot = hall.daySlots?.find(
                                       (s: any) =>
                                          s._id === booking.slot ||
                                          s._id === booking.slot?._id
                                    );
                                    if (!slot) return null;

                                    const style = getPositionStyle(
                                       slot.startTime,
                                       slot.endTime
                                    );
                                    return (
                                       <div
                                          key={booking._id}
                                          className="absolute top-0 bottom-0 bg-blue-100/90 border border-blue-200 rounded-md flex items-center px-2 z-20 shadow-sm overflow-hidden hover:bg-blue-100 transition-colors cursor-pointer"
                                          style={style}
                                          title={`Booked by ${booking.user?.name || 'Instructor'} for ${booking.course?.basicInfo?.title || 'Unknown Course'}`}
                                          onClick={() => {
                                             setSelectedBooking({
                                                ...booking,
                                                hallName: hall.name,
                                                slotTime: {
                                                   start: slot.startTime,
                                                   end: slot.endTime,
                                                },
                                             });
                                             setIsDetailsOpen(true);
                                          }}
                                       >
                                          <div className="flex items-center gap-1.5 min-w-0 w-full">
                                             <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                                                <User
                                                   size={10}
                                                   className="text-blue-700"
                                                />
                                             </div>
                                             <div className="min-w-0 flex-1">
                                                <div className="text-[10px] font-semibold text-blue-900 truncate leading-tight">
                                                   {booking.user
                                                      ? `${booking.user.firstname} ${booking.user.lastname}`
                                                      : 'Booked'}
                                                </div>
                                                <div className="text-[9px] text-blue-700 truncate leading-tight opacity-90">
                                                   {booking.course?.basicInfo
                                                      ?.title || 'No Course'}
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="p-12 text-center text-gray-500">
                        No halls found for this date.
                     </div>
                  )}
               </div>
            </div>
         )}

         <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Booking Details</DialogTitle>
               </DialogHeader>
               {selectedBooking && selectedBooking.user ? (
                  <div className="space-y-6">
                     {/* Instructor Info */}
                     <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                           <AvatarImage src={selectedBooking.user.avatar} />
                           <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                              {selectedBooking.user.firstname?.[0]}
                              {selectedBooking.user.lastname?.[0]}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <h3 className="font-semibold text-gray-900">
                              {selectedBooking.user.firstname}{' '}
                              {selectedBooking.user.lastname}
                           </h3>
                           <p className="text-sm text-gray-500">
                              {selectedBooking.user.email}
                           </p>
                           <div className="flex gap-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                 Instructor
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Booking Info */}
                     <div className="space-y-4">
                        <div>
                           <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course
                           </label>
                           <p className="text-sm font-medium text-gray-900 mt-1">
                              {selectedBooking.course?.basicInfo?.title || (
                                 <span className="italic text-gray-400">
                                    No Course Title
                                 </span>
                              )}
                           </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Date
                              </label>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                 {format(new Date(date), 'MMMM d, yyyy')}
                              </p>
                           </div>
                           <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Hall
                              </label>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                 {selectedBooking.hallName}
                              </p>
                           </div>
                        </div>

                        <div className="p-3 bg-blue-50 text-blue-900 rounded-md text-sm font-medium text-center">
                           {selectedBooking.slotTime ? (
                              <>
                                 {format(
                                    new Date(selectedBooking.slotTime.start),
                                    'h:mm a'
                                 )}{' '}
                                 -{' '}
                                 {format(
                                    new Date(selectedBooking.slotTime.end),
                                    'h:mm a'
                                 )}
                              </>
                           ) : (
                              'Booked Slot'
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="py-10 text-center text-gray-500">
                     Loading details...
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
}
