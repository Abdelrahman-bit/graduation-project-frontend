import React from 'react';
import HallsManager from './components/HallsManager';

const HallsPage = () => {
   return (
      <div className="p-6 md:p-8 space-y-6 min-h-screen bg-[#F5F7FA]">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Manage Halls
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                  Add, edit, or remove workshop halls.
               </p>
            </div>
         </div>

         <HallsManager />
      </div>
   );
};

export default HallsPage;
