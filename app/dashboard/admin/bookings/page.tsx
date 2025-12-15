import React from 'react';
import BookingsManager from './components/BookingsManager';

const BookingsPage = () => {
   return (
      <div className="p-6 md:p-8 space-y-6 min-h-screen bg-[#F5F7FA]">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Hall Bookings
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                  Manage schedules and reservations.
               </p>
            </div>
         </div>

         <BookingsManager />
      </div>
   );
};

export default BookingsPage;
