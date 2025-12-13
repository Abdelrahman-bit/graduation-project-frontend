import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { CourseDTO } from '@/app/services/courseService';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
   Clock,
   Layers,
   FileText,
   PlayCircle,
   ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface CourseDetailsModalProps {
   isOpen: boolean;
   onClose: () => void;
   course: CourseDTO | null;
   onApprove?: (course: CourseDTO) => void;
   onReject?: (course: CourseDTO) => void;
   isReviewMode?: boolean; // If true, shows Approve/Reject buttons
   isLoading?: boolean;
}

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
   isOpen,
   onClose,
   course,
   onApprove,
   onReject,
   isReviewMode = false,
   isLoading = false,
}) => {
   if (!course) return null;

   const handleViewContent = () => {
      window.open(`/course/${course._id}`, '_blank');
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-none rounded-2xl overflow-hidden bg-white flex flex-col outline-none">
            {/* 1. Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
               {/* Hero Banner Image */}
               <div className="relative h-56 w-full">
                  {course.advancedInfo?.thumbnail?.url ? (
                     <Image
                        src={course.advancedInfo.thumbnail.url}
                        alt="Cover"
                        fill
                        className="object-cover"
                     />
                  ) : (
                     <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                        No Image
                     </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                           {course.basicInfo.category}
                        </span>
                        <span className="flex items-center gap-1 text-gray-300 text-xs font-medium">
                           <Clock size={12} /> Status: {course.status}
                        </span>
                     </div>
                     <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                        {course.basicInfo.title}
                     </DialogTitle>
                     <DialogDescription className="text-gray-300 text-sm line-clamp-1">
                        {course.basicInfo.subtitle}
                     </DialogDescription>
                  </div>
               </div>

               {/* Content Body */}
               <div className="p-6 md:p-8 space-y-8">
                  {/* Stats Bar (Instructor) */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                     {/* Instructor */}
                     <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-orange-600 font-bold shadow-sm relative overflow-hidden">
                           {typeof course.instructor === 'object' &&
                           course.instructor?.avatar ? (
                              <Image
                                 src={course.instructor.avatar}
                                 alt="Instructor"
                                 fill
                                 className="object-cover"
                              />
                           ) : typeof course.instructor === 'object' ? (
                              course.instructor?.firstname?.charAt(0)
                           ) : (
                              'U'
                           )}
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[10px] text-gray-400 uppercase font-bold">
                              Instructor
                           </p>
                           <p className="text-sm font-bold text-gray-900 truncate">
                              {typeof course.instructor === 'object'
                                 ? `${course.instructor?.firstname || ''} ${course.instructor?.lastname || ''}`.trim()
                                 : 'Unknown'}
                           </p>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                           <Layers size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-400 uppercase font-bold">
                              Content
                           </p>
                           <p className="text-sm font-bold text-gray-900">
                              {course.curriculum?.sections?.length || 0}{' '}
                              Sections
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* About Description */}
                  <section>
                     <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                        <FileText size={16} className="text-orange-500" /> About
                        Course
                     </h3>
                     <div className="text-sm text-gray-600 leading-7">
                        {course.advancedInfo?.description ||
                           'No description provided.'}
                     </div>
                  </section>

                  {/* Curriculum */}
                  <section>
                     <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                        <Layers size={16} className="text-blue-500" />{' '}
                        Curriculum
                     </h3>
                     <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                        {course.curriculum?.sections?.map((section, idx) => (
                           <div key={idx} className="bg-white">
                              <div className="bg-gray-50 px-4 py-3 text-xs font-bold text-gray-700 uppercase flex justify-between items-center">
                                 <span>{section.title}</span>
                                 <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-full text-[10px] text-gray-500">
                                    {section.lectures.length} Lectures
                                 </span>
                              </div>
                              <div className="px-4 py-2 space-y-1">
                                 {section.lectures.map((lecture, lIdx) => (
                                    <div
                                       key={lIdx}
                                       className="flex items-center gap-3 text-sm text-gray-600 py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                                    >
                                       <PlayCircle
                                          size={14}
                                          className="text-gray-400"
                                       />
                                       {lecture.title}
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>

            {/* 2. Fixed Footer Actions */}
            <div className="p-4 md:p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 z-10">
               {/* View Content Button (Always Visible) */}
               {/* <Button
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={handleViewContent}
                >
                    <ExternalLink size={16} className="mr-2" /> View Public Page
                </Button> */}
               <div className="flex-1"></div> {/* Spacer */}
               {isReviewMode && onReject && onApprove && (
                  <div className="flex gap-3 w-full sm:w-auto">
                     <Button
                        variant="ghost"
                        className="flex-1 sm:flex-none text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onReject(course)}
                        disabled={isLoading}
                     >
                        Reject
                     </Button>

                     <Button
                        className="flex-1 sm:flex-[2] bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={() => onApprove(course)}
                        disabled={isLoading}
                     >
                        Approve Course
                     </Button>
                  </div>
               )}
               {!isReviewMode && (
                  <Button variant="outline" onClick={onClose}>
                     Close
                  </Button>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default CourseDetailsModal;
