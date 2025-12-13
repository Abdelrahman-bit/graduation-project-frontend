'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JoinRequestsTab from './components/JoinRequestsTab';
import InstructorsTab from './components/InstructorsTab';

export default function InstructorsPage() {
   return (
      <div className="p-6 space-y-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">
               Instructors Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
               Manage instructor requests and view current instructor list.
            </p>
         </div>

         <Tabs defaultValue="requests" className="w-full">
            <TabsList className="bg-white border p-1 w-full max-w-md grid grid-cols-2">
               <TabsTrigger
                  value="requests"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:text-orange-500 data-[state=active]:hover:text-white"
               >
                  Join Requests
               </TabsTrigger>
               <TabsTrigger
                  value="current"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white hover:text-orange-500 data-[state=active]:hover:text-white"
               >
                  Current Instructors
               </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="mt-6">
               <JoinRequestsTab />
            </TabsContent>

            <TabsContent value="current" className="mt-6">
               <InstructorsTab />
            </TabsContent>
         </Tabs>
      </div>
   );
}
