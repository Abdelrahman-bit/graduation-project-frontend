import React from 'react';
import CourseCard from '../CourseCard/CourseCard';

export default function BestSellingSection() {
   return (
      <section className="py-20 bg-gray-50 ">
         <div className=" flex flex-col gap-10 px-4 md:px-0">
            <h2 className="section-header text-center text-3xl font-bold text-gray-800">
               Best Selling Courses
            </h2>
            {/* courses grid container TODO*/}
            <div className="lg:w-4/5 mx-auto grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
               <CourseCard />
            </div>
         </div>
      </section>
   );
}
