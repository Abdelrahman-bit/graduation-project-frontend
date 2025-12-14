'use client';

import React, { useState, useMemo } from 'react';
import {
   format,
   addDays,
   startOfWeek,
   isSameDay,
   parseISO,
   isWithinInterval,
   startOfDay,
   getHours,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Slot {
   _id: string;
   startTime: string; // ISO string
   endTime: string; // ISO string
   isBooked?: boolean; // You might need to populate this or check against bookings
}

interface CalendarComponentProps {
   slots: Slot[];
   role: 'admin' | 'instructor';
   onSlotClick?: (slot: Slot) => void;
   onDateCheck?: (date: Date) => void;
   onEmptySlotClick?: (date: Date) => void;
   className?: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
   slots,
   role,
   onSlotClick,
   onEmptySlotClick,
   className,
}) => {
   const [currentDate, setCurrentDate] = useState(new Date());

   // Calculate week view
   const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
   const weekDays = useMemo(() => {
      return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
   }, [startDate]);

   // Helper to filter slots for a specific day and hour
   const getSlotsForCell = (day: Date, hour: number) => {
      return slots.filter((slot) => {
         const slotStart = new Date(slot.startTime);
         return isSameDay(slotStart, day) && getHours(slotStart) === hour;
      });
   };

   // Generate hours for the day (e.g., 8 AM to 10 PM)
   const hours = Array.from({ length: 15 }).map((_, i) => i + 8); // 08:00 - 22:00

   return (
      <div
         className={cn(
            'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
            className
         )}
      >
         {/* Header - Date Navigation (Simplified for now) */}
         <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">
               {format(startDate, 'MMMM yyyy')}
            </h3>
            <div className="flex gap-2">
               <button
                  onClick={() => setCurrentDate(addDays(currentDate, -7))}
                  className="px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
               >
                  Previous Week
               </button>
               <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-primary-50 text-primary-600 rounded-md border border-primary-100"
               >
                  Today
               </button>
               <button
                  onClick={() => setCurrentDate(addDays(currentDate, 7))}
                  className="px-3 py-1 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
               >
                  Next Week
               </button>
            </div>
         </div>

         {/* Calendar Grid */}
         <div className="grid grid-cols-8 divide-x divide-gray-100">
            {/* Time Column Header */}
            <div className="bg-gray-50 p-3 text-xs font-medium text-gray-500 text-center">
               Time
            </div>
            {/* Day Headers */}
            {weekDays.map((day) => (
               <div
                  key={day.toString()}
                  className={cn(
                     'p-3 text-center transition-colors',
                     isSameDay(day, new Date()) ? 'bg-primary-50' : 'bg-white'
                  )}
               >
                  <div
                     className={cn(
                        'text-xs font-medium uppercase mb-1',
                        isSameDay(day, new Date())
                           ? 'text-primary-600'
                           : 'text-gray-500'
                     )}
                  >
                     {format(day, 'EEE')}
                  </div>
                  <div
                     className={cn(
                        'text-sm font-bold',
                        isSameDay(day, new Date())
                           ? 'text-primary-700'
                           : 'text-gray-900'
                     )}
                  >
                     {format(day, 'd')}
                  </div>
               </div>
            ))}

            {/* Time Slots */}
            {hours.map((hour) => (
               <React.Fragment key={hour}>
                  {/* Time Label */}
                  <div className="p-2 text-xs text-gray-400 text-center font-medium border-t border-gray-100 bg-gray-50/50">
                     {format(new Date().setHours(hour, 0, 0, 0), 'ha')}
                  </div>

                  {/* Day Cells */}
                  {weekDays.map((day) => {
                     const cellSlots = getSlotsForCell(day, hour);
                     return (
                        <div
                           key={`${day}-${hour}`}
                           className="min-h-[60px] border-t border-gray-100 p-1 relative group transition-colors hover:bg-gray-50/50"
                        >
                           {cellSlots.map((slot) => (
                              <button
                                 key={slot._id}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    onSlotClick && onSlotClick(slot);
                                 }}
                                 disabled={false} // Allow clicking to handle cancellation or viewing details
                                 className={cn(
                                    'w-full h-full rounded-md text-xs font-medium flex items-center justify-center transition-all p-1 mb-1',
                                    slot.isBooked
                                       ? 'bg-red-50 text-red-600 border border-red-100 cursor-pointer'
                                       : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:shadow-sm cursor-pointer'
                                 )}
                              >
                                 {slot.isBooked ? 'Booked' : 'Available'}
                              </button>
                           ))}
                           {cellSlots.length === 0 && role === 'admin' && (
                              <div
                                 className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                                 onClick={() => {
                                    const clickDate = new Date(day);
                                    clickDate.setHours(hour, 0, 0, 0);
                                    onEmptySlotClick &&
                                       onEmptySlotClick(clickDate);
                                 }}
                              >
                                 <span className="text-[10px] text-gray-400 font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">
                                    +
                                 </span>
                              </div>
                           )}
                        </div>
                     );
                  })}
               </React.Fragment>
            ))}
         </div>
      </div>
   );
};

export default CalendarComponent;
