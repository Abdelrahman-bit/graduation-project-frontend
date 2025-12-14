'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHalls } from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Banknote, CalendarCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstructorHallsPage() {
   const router = useRouter();
   const { data: halls, isLoading } = useQuery({
      queryKey: ['halls'],
      queryFn: getHalls,
   });

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">Book a Hall</h1>
               <p className="text-sm text-gray-500 mt-1">
                  View available halls and schedule your sessions.
               </p>
            </div>
         </div>

         {isLoading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
         ) : !halls || halls.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed">
               <p className="text-gray-500">
                  No halls available at the moment.
               </p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {halls.map((hall: any) => (
                  <div
                     key={hall._id}
                     className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                     <div className="h-40 bg-gray-100 relative">
                        {/* Placeholder for Hall Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                           <Users size={48} className="opacity-20" />
                        </div>
                        <div className="absolute top-3 right-3">
                           <Badge
                              variant="secondary"
                              className="bg-white/90 backdrop-blur"
                           >
                              {hall.capacity} Seats
                           </Badge>
                        </div>
                     </div>
                     <div className="p-5 space-y-4">
                        <div>
                           <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                              {hall.name}
                           </h3>
                           <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {hall.description || 'No description provided.'}
                           </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                           <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                              <Banknote size={16} className="text-gray-400" />
                              {hall.pricePerHour || hall.hourlyPrice} EGP
                              <span className="text-xs text-gray-400 font-normal">
                                 /hr
                              </span>
                           </div>
                           <Button
                              size="sm"
                              onClick={() =>
                                 router.push(
                                    `/dashboard/instructor/halls/${hall._id}`
                                 )
                              }
                           >
                              View & Book
                           </Button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
