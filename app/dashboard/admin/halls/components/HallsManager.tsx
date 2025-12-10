'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
   getHalls,
   createHall,
   updateHall,
   deleteHall,
   Hall,
   HallFacilities,
   HallSlot,
} from '@/app/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import {
   Plus,
   Users,
   Edit2,
   Trash2,
   Building,
   Loader2,
   Wifi,
   Monitor,
   Wind,
   Mic,
   Speaker,
   Projector,
   UploadCloud,
   X,
} from 'lucide-react';
import Image from 'next/image';

// Constants
const DAYS_OF_WEEK = [
   'Sunday',
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday',
];

// Interface for Form State
interface HallFormData {
   name: string;
   capacity: string;
   hourlyRate: string;
   imageFile: File | null;
   imagePreview: string; // URL for display
   availableBooking: boolean;
   facilities: HallFacilities;
}

export default function HallsComponent() {
   // --- Global State ---
   const [halls, setHalls] = useState<Hall[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);

   // --- Modal State ---
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingHallId, setEditingHallId] = useState<string | null>(null);

   // --- Form Data State ---
   const [formData, setFormData] = useState<HallFormData>({
      name: '',
      capacity: '',
      hourlyRate: '',
      imageFile: null,
      imagePreview: '',
      availableBooking: true, // Default true on create
      facilities: {
         hasAC: false,
         hasWhiteboard: false,
         hasInteractiveScreen: false,
         hasSoundSystem: false,
         hasMic: false,
         hasProjector: false,
         hasWifi: false,
      },
   });

   // --- Slots State (Only for Edit Mode) ---
   const [slots, setSlots] = useState<HallSlot[]>([]);
   const [newSlot, setNewSlot] = useState({
      day: 'Sunday',
      startTime: '',
      endTime: '',
   });

   // --- Fetch Data ---
   const loadHalls = async () => {
      try {
         setIsLoading(true);
         const data = await getHalls();
         setHalls(data);
      } catch (error) {
         console.error(error);
         toast.error('Failed to load halls data');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      loadHalls();
   }, []);

   // --- Handlers ---

   const openAddModal = () => {
      setEditingHallId(null);
      // Reset Form
      setFormData({
         name: '',
         capacity: '',
         hourlyRate: '',
         imageFile: null,
         imagePreview: '',
         availableBooking: true,
         facilities: {
            hasAC: false,
            hasWhiteboard: false,
            hasInteractiveScreen: false,
            hasSoundSystem: false,
            hasMic: false,
            hasProjector: false,
            hasWifi: false,
         },
      });
      setSlots([]); // No slots on creation
      setIsModalOpen(true);
   };

   const openEditModal = (hall: Hall) => {
      setEditingHallId(hall.id);
      // Populate Form
      setFormData({
         name: hall.name,
         capacity: hall.capacity.toString(),
         hourlyRate: hall.hourlyRate.toString(),
         imageFile: null,
         imagePreview: hall.image || '',
         availableBooking: hall.availableBooking,
         facilities: { ...hall.facilities },
      });
      setSlots(hall.slots || []);
      setIsModalOpen(true);
   };

   const closeModal = () => setIsModalOpen(false);

   // Handle Text Inputs
   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
   };

   // Handle Image File Upload
   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const previewUrl = URL.createObjectURL(file);
         setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: previewUrl,
         }));
      }
   };

   // Handle Facilities Checkboxes
   const toggleFacility = (key: keyof HallFacilities) => {
      setFormData((prev) => ({
         ...prev,
         facilities: {
            ...prev.facilities,
            [key]: !prev.facilities[key],
         },
      }));
   };

   // Handle Slots (Add)
   const handleAddSlot = () => {
      if (!newSlot.startTime || !newSlot.endTime) {
         toast.error('Please fill start and end time');
         return;
      }
      const slotToAdd: HallSlot = {
         id: Date.now().toString(), // Temp ID
         ...newSlot,
      };
      setSlots((prev) => [...prev, slotToAdd]);
      setNewSlot({ day: 'Sunday', startTime: '', endTime: '' }); // Reset Inputs
   };

   // Handle Slots (Delete)
   const handleDeleteSlot = (slotId: string) => {
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
   };

   // --- Submit Logic ---
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const payload = {
         name: formData.name,
         capacity: parseInt(formData.capacity),
         hourlyRate: parseFloat(formData.hourlyRate),
         facilities: formData.facilities,
         availableBooking: formData.availableBooking,
         slots: editingHallId ? slots : [], // Only save slots if editing
         image: formData.imagePreview, // Note: In real backend, send formData.imageFile via FormData
      };

      try {
         if (editingHallId) {
            await updateHall(editingHallId, payload);
            toast.success('Hall updated successfully');
         } else {
            await createHall(payload);
            toast.success('Hall created successfully');
         }
         await loadHalls(); // Refresh UI
         closeModal();
      } catch (error) {
         console.error(error);
         toast.error('Operation failed');
      } finally {
         setIsSubmitting(false);
      }
   };

   // --- Delete Handler ---
   const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this hall?')) {
         try {
            await deleteHall(id);
            toast.success('Hall deleted successfully');
            loadHalls();
         } catch (error) {
            toast.error('Failed to delete hall');
         }
      }
   };

   // --- Loading UI ---
   if (isLoading) {
      return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
               <div key={i} className="h-80 bg-gray-200 rounded-xl" />
            ))}
         </div>
      );
   }

   return (
      <div className="w-full">
         {/* Header */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">
                  Halls Management
               </h1>
               <p className="text-gray-500 text-sm">
                  Manage your facility spaces and configurations.
               </p>
            </div>
            <Button
               onClick={openAddModal}
               className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-sm transition-all"
            >
               <Plus size={18} /> Add New Hall
            </Button>
         </div>

         {/* Halls Grid Display */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {halls.map((hall) => (
               <div
                  key={hall.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-100 transition-all duration-300 flex flex-col"
               >
                  {/* Image Area */}
                  <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                     {hall.image ? (
                        <Image
                           src={hall.image}
                           alt={hall.name}
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                           <Building size={48} />
                        </div>
                     )}

                     {/* Overlay & Badges */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                     <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-sm">
                        <Users size={14} className="text-orange-500" />
                        {hall.capacity}
                     </div>

                     <div
                        className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5
                    ${hall.availableBooking ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                     >
                        <span
                           className={`w-1.5 h-1.5 rounded-full bg-white ${hall.availableBooking ? 'animate-pulse' : ''}`}
                        />
                        {hall.availableBooking ? 'Bookable' : 'Closed'}
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1">
                     <div className="mb-4">
                        <div className="flex justify-between items-start">
                           <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                              {hall.name}
                           </h3>
                           <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                              ${hall.hourlyRate}/hr
                           </span>
                        </div>
                     </div>

                     {/* Facilities Icons Row */}
                     <div className="flex flex-wrap gap-3 mb-6 pt-2 border-t border-dashed border-gray-200">
                        {hall.facilities.hasWifi && (
                           <Wifi
                              size={16}
                              className="text-gray-400"
                              aria-label="WiFi"
                           />
                        )}
                        {hall.facilities.hasAC && (
                           <Wind
                              size={16}
                              className="text-gray-400"
                              aria-label="AC"
                           />
                        )}
                        {hall.facilities.hasProjector && (
                           <Projector
                              size={16}
                              className="text-gray-400"
                              aria-label="Projector"
                           />
                        )}
                        {hall.facilities.hasMic && (
                           <Mic
                              size={16}
                              className="text-gray-400"
                              aria-label="Microphone"
                           />
                        )}
                        {hall.facilities.hasSoundSystem && (
                           <Speaker
                              size={16}
                              className="text-gray-400"
                              aria-label="Sound System"
                           />
                        )}
                        {hall.facilities.hasInteractiveScreen && (
                           <Monitor
                              size={16}
                              className="text-gray-400"
                              aria-label="Interactive Screen"
                           />
                        )}
                     </div>

                     {/* Action Buttons */}
                     <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <Button
                           variant="outline"
                           className="w-full border-gray-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                           onClick={() => openEditModal(hall)}
                        >
                           <Edit2 size={16} className="mr-2" /> Edit
                        </Button>
                        <Button
                           variant="ghost"
                           className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                           onClick={() => handleDelete(hall.id)}
                        >
                           <Trash2 size={16} className="mr-2" /> Delete
                        </Button>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* --- Main Modal (Create / Edit) --- */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className=" w-full max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>
                     {editingHallId
                        ? 'Edit Hall Configuration'
                        : 'Create New Hall'}
                  </DialogTitle>
                  <DialogDescription>
                     {editingHallId
                        ? 'Update details, facilities, and time slots.'
                        : 'Fill in the details to add a new hall to the system.'}
                  </DialogDescription>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* 1. Basic Info Section */}
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                     <div className="space-y-2 col-span-2">
                        <Label htmlFor="name">
                           Hall Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                           id="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           required
                           placeholder="e.g. Grand Auditorium"
                        />
                     </div>

                     <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor="capacity">
                           Capacity (Persons){' '}
                           <span className="text-red-500">*</span>
                        </Label>
                        <Input
                           id="capacity"
                           type="number"
                           value={formData.capacity}
                           onChange={handleInputChange}
                           required
                        />
                     </div>

                     <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label htmlFor="hourlyRate">
                           Hourly Rate (EGP){' '}
                           <span className="text-red-500">*</span>
                        </Label>
                        <Input
                           id="hourlyRate"
                           type="number"
                           value={formData.hourlyRate}
                           onChange={handleInputChange}
                           required
                        />
                     </div>
                  </div>

                  {/* 2. Image Upload Section (File Input) */}
                  <div className="space-y-2">
                     <Label>Hall Image</Label>
                     <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <input
                           type="file"
                           accept="image/*"
                           onChange={handleImageUpload}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {formData.imagePreview ? (
                           <div className="relative w-full h-40">
                              <Image
                                 src={formData.imagePreview}
                                 alt="Preview"
                                 fill
                                 className="object-cover rounded-md"
                              />
                           </div>
                        ) : (
                           <div className="flex flex-col items-center text-gray-400">
                              <UploadCloud size={32} className="mb-2" />
                              <span className="text-sm">
                                 Click to upload image
                              </span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* 3. Facilities Checkboxes (Dynamic Grid) */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <Label className="text-base font-semibold">
                        Facilities & Equipment
                     </Label>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {/* Iterate over facilities keys */}
                        {Object.keys(formData.facilities).map((key) => {
                           const facilityKey = key as keyof HallFacilities;
                           // Format label: "hasWhiteboard" -> "Whiteboard"
                           const label = key
                              .replace('has', '')
                              .replace(/([A-Z])/g, ' $1')
                              .trim();
                           return (
                              <div
                                 key={key}
                                 className="flex items-center space-x-2"
                              >
                                 <input
                                    type="checkbox"
                                    id={key}
                                    checked={formData.facilities[facilityKey]}
                                    onChange={() => toggleFacility(facilityKey)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                 />
                                 <label
                                    htmlFor={key}
                                    className="text-sm text-gray-700 cursor-pointer select-none"
                                 >
                                    {label}
                                 </label>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  {/* 4. Edit Mode ONLY Features (Slots & Status) */}
                  {editingHallId && (
                     <div className="border-t pt-6 space-y-6">
                        {/* Booking Availability Switch */}
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                           <div>
                              <Label
                                 htmlFor="availableBooking"
                                 className="text-base font-semibold text-gray-900"
                              >
                                 Available for Booking
                              </Label>
                              <p className="text-sm text-gray-500">
                                 Enable or disable new bookings for this hall.
                              </p>
                           </div>
                           <div className="flex items-center gap-2">
                              <span
                                 className={`text-sm font-bold ${formData.availableBooking ? 'text-green-600' : 'text-gray-400'}`}
                              >
                                 {formData.availableBooking
                                    ? 'Active'
                                    : 'Inactive'}
                              </span>
                              <input
                                 type="checkbox"
                                 id="availableBooking"
                                 checked={formData.availableBooking}
                                 onChange={(e) =>
                                    setFormData((prev) => ({
                                       ...prev,
                                       availableBooking: e.target.checked,
                                    }))
                                 }
                                 className="w-5 h-5 text-orange-600"
                              />
                           </div>
                        </div>

                        {/* Slots Management */}
                        <div className="space-y-4">
                           <Label className="text-base font-semibold">
                              Manage Availability Slots
                           </Label>

                           {/* Add Slot Inputs - Responsive Layout */}
                           {/* Changed: 'flex' to 'flex flex-col sm:flex-row' to stack on mobile */}
                           <div className="flex flex-col sm:flex-row gap-3 sm:items-end bg-gray-50 p-4 rounded-lg">
                              <div className="space-y-1 w-full sm:flex-1">
                                 <span className="text-xs text-gray-500">
                                    Day
                                 </span>
                                 <select
                                    className="w-full text-sm border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={newSlot.day}
                                    onChange={(e) =>
                                       setNewSlot({
                                          ...newSlot,
                                          day: e.target.value,
                                       })
                                    }
                                 >
                                    {DAYS_OF_WEEK.map((d) => (
                                       <option key={d} value={d}>
                                          {d}
                                       </option>
                                    ))}
                                 </select>
                              </div>

                              <div className="flex gap-3 w-full sm:flex-[2]">
                                 <div className="space-y-1 flex-1">
                                    <span className="text-xs text-gray-500">
                                       Start
                                    </span>
                                    <Input
                                       type="time"
                                       className="w-full bg-white"
                                       value={newSlot.startTime}
                                       onChange={(e) =>
                                          setNewSlot({
                                             ...newSlot,
                                             startTime: e.target.value,
                                          })
                                       }
                                    />
                                 </div>
                                 <div className="space-y-1 flex-1">
                                    <span className="text-xs text-gray-500">
                                       End
                                    </span>
                                    <Input
                                       type="time"
                                       className="w-full bg-white"
                                       value={newSlot.endTime}
                                       onChange={(e) =>
                                          setNewSlot({
                                             ...newSlot,
                                             endTime: e.target.value,
                                          })
                                       }
                                    />
                                 </div>
                              </div>

                              <Button
                                 type="button"
                                 onClick={handleAddSlot}
                                 className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white hover:bg-gray-800"
                              >
                                 Add Slot
                              </Button>
                           </div>

                           {/* Render Slots List */}
                           <div className="space-y-2">
                              {slots.length === 0 && (
                                 <p className="text-sm text-gray-400 italic text-center py-2">
                                    No slots configured yet.
                                 </p>
                              )}
                              {slots.map((slot) => (
                                 <div
                                    key={slot.id}
                                    className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50 transition-colors"
                                 >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                       <span className="font-semibold text-gray-900 min-w-[80px]">
                                          {slot.day}
                                       </span>
                                       <span className="text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">
                                          {slot.startTime} - {slot.endTime}
                                       </span>
                                    </div>
                                    <button
                                       type="button"
                                       onClick={() => handleDeleteSlot(slot.id)}
                                       className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                       title="Remove Slot"
                                    >
                                       <X size={18} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 text-white min-w-[140px]"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {editingHallId ? 'Save Changes' : 'Create Hall'}
                     </Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
