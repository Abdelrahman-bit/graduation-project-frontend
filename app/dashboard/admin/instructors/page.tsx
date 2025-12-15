import React from 'react';
import InstructorsTable from './components/InstructorsTable';

const InstructorsPage = () => {
   return (
      <div className="p-6 md:p-8 space-y-6 min-h-screen bg-[#F5F7FA]">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Instructors Management
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                  Search and view details of all instructors.
               </p>
            </div>
         </div>

         <InstructorsTable />
      </div>
   );
};

export default InstructorsPage;
