import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { LuUserRound } from 'react-icons/lu';

import {
   HoverCard,
   HoverCardContent,
   HoverCardTrigger,
} from '@/components/ui/hover-card';
import CourseDetailsCard from './CourseDetailsCard';

export default function CourseCard({ displayIcon = false }) {
   return (
      <HoverCard>
         <HoverCardTrigger asChild>
            <div className="group w-full h-full bg-white flex flex-col gap-3 border border-gray-scale-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer rounded-md overflow-hidden">
               <div className="relative w-full aspect-[1.6] overflow-hidden bg-gray-100">
                  <Image
                     src="/course.png"
                     alt="Course Image"
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                  />
               </div>

               {/* --- Card Content --- */}
               <div className="px-3.5 pb-3 flex flex-col flex-1 gap-2">
                  <div className="flex justify-between items-start">
                     <span className="text-[10px] uppercase py-1 px-2 rounded text-primary-700 bg-primary-100 font-bold tracking-wider">
                        Design
                     </span>
                     <span className="text-lg text-primary-500 font-bold">
                        $57
                     </span>
                  </div>

                  <h3 className="font-semibold text-base text-gray-900 leading-tight line-clamp-2 mb-auto">
                     Machine Learning A-Z™: Hands-On Python & R in Data Science
                  </h3>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                     <div className="flex gap-1.5 items-center">
                        <FaStar size={14} className="text-yellow-400" />
                        <span className="text-sm font-bold text-gray-700">
                           5.0
                        </span>
                     </div>

                     <div className="flex gap-1.5 items-center text-gray-500">
                        {displayIcon && (
                           <LuUserRound size={16} className="text-gray-400" />
                        )}
                        <span className="text-sm font-medium">265.7K</span>
                        <span className="text-xs">students</span>
                     </div>
                  </div>
               </div>
            </div>
         </HoverCardTrigger>

         <HoverCardContent
            side="right"
            align="start"
            sideOffset={10}
            className="w-[360px] hidden lg:block z-50"
         >
            <CourseDetailsCard />
         </HoverCardContent>
      </HoverCard>
   );
}
