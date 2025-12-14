'use client';

import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { Hall } from '@/app/services/adminService';

const hallSchema = z.object({
   name: z.string().min(3, 'Hall name is required'),
   capacity: z.coerce.number().min(5, 'Capacity must be at least 5'),
   hourlyPrice: z.coerce.number().min(0, 'Minimum price is 0'),
   description: z.string().optional(),
   facilities: z.array(z.string()).optional(),
   // Schedule Configuration (Optional for creation)
   startTime: z.string().optional(),
   endTime: z.string().optional(),
   excludedDays: z.array(z.string()).optional(),
});

type HallFormValues = z.infer<typeof hallSchema>;

interface HallFormModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: HallFormValues) => void;
   initialData?: Hall | null; // For editing
   isLoading: boolean;
}

const FACILITY_OPTIONS = [
   { id: 'hasAC', label: 'Air Conditioning' },
   { id: 'hasProjector', label: 'Projector' },
   { id: 'hasWhiteboard', label: 'Whiteboard' },
   { id: 'hasWifi', label: 'WiFi' },
   { id: 'hasSoundSystem', label: 'Sound System' },
   { id: 'hasInteractiveScreen', label: 'Interactive Screen' },
   { id: 'hasMic', label: 'Microphone' },
];

const DAYS_OF_WEEK = [
   'Sunday',
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday',
];

export const HallFormModal: React.FC<HallFormModalProps> = ({
   isOpen,
   onClose,
   onSubmit,
   initialData,
   isLoading,
}) => {
   const form = useForm<HallFormValues>({
      resolver: zodResolver(hallSchema),
      defaultValues: {
         name: '',
         capacity: 20,
         hourlyPrice: 150,
         description: '',
         facilities: [],
         startTime: '09:00',
         endTime: '17:00',
         excludedDays: ['Friday'],
      },
   });

   useEffect(() => {
      if (isOpen) {
         if (initialData) {
            const activeFacilities: string[] = [];
            if (initialData.facilities) {
               const fac = initialData.facilities as any;
               if (Array.isArray(fac)) {
                  form.reset({ ...initialData, facilities: fac });
               } else {
                  FACILITY_OPTIONS.forEach((opt) => {
                     if (fac[opt.id]) activeFacilities.push(opt.id);
                  });
                  form.reset({
                     name: initialData.name,
                     capacity: initialData.capacity,
                     hourlyPrice:
                        initialData.pricePerHour ||
                        (initialData as any).hourlyPrice,
                     description: (initialData as any).description || '',
                     facilities: activeFacilities,
                  });
               }
            } else {
               form.reset({
                  name: initialData.name,
                  capacity: initialData.capacity,
                  hourlyPrice: (initialData as any).hourlyPrice,
                  description: (initialData as any).description || '',
                  facilities: [],
               });
            }
         } else {
            form.reset({
               name: '',
               capacity: 20,
               hourlyPrice: 150,
               description: '',
               facilities: [],
               startTime: '09:00',
               endTime: '17:00',
               excludedDays: ['Friday'],
            });
         }
      }
   }, [isOpen, initialData, form]);

   const handleSubmit = (values: HallFormValues) => {
      const facilityObject: any = {};
      FACILITY_OPTIONS.forEach((opt) => {
         // @ts-ignore
         facilityObject[opt.id] = values.facilities?.includes(opt.id);
      });

      const payload = {
         ...values,
         facilities: facilityObject,
         slotConfiguration: !initialData
            ? {
                 startTime: values.startTime,
                 endTime: values.endTime,
                 excludedDays: values.excludedDays,
              }
            : undefined,
      };

      // @ts-ignore
      onSubmit(payload);
   };

   const handleFacilityChange = (checked: boolean, facilityId: string) => {
      const currentBy = form.getValues('facilities') || [];
      if (checked) {
         form.setValue('facilities', [...currentBy, facilityId]);
      } else {
         form.setValue(
            'facilities',
            currentBy.filter((id) => id !== facilityId)
         );
      }
   };

   const handleDayChange = (checked: boolean, day: string) => {
      const current = form.getValues('excludedDays') || [];
      if (checked) {
         form.setValue('excludedDays', [...current, day]);
      } else {
         form.setValue(
            'excludedDays',
            current.filter((d) => d !== day)
         );
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>
                  {initialData ? 'Edit Hall' : 'Create New Hall'}
               </DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
               >
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Hall Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g. Conference Room A"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                 <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="hourlyPrice"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Hourly Rate (EGP)</FormLabel>
                              <FormControl>
                                 <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Optional description..."
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="space-y-2">
                     <FormLabel>Facilities</FormLabel>
                     <div className="grid grid-cols-2 gap-2">
                        {FACILITY_OPTIONS.map((opt) => (
                           <div
                              key={opt.id}
                              className="flex items-center space-x-2"
                           >
                              <Switch
                                 id={opt.id}
                                 checked={form
                                    .watch('facilities')
                                    ?.includes(opt.id)}
                                 onCheckedChange={(checked) =>
                                    handleFacilityChange(checked, opt.id)
                                 }
                              />
                              <label
                                 htmlFor={opt.id}
                                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                 {opt.label}
                              </label>
                           </div>
                        ))}
                     </div>
                  </div>

                  {!initialData && (
                     <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium text-sm">
                           Initial Schedule (Next 1 Month)
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                           <FormField
                              control={form.control}
                              name="startTime"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                       <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           <FormField
                              control={form.control}
                              name="endTime"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                       <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        <div className="space-y-2">
                           <FormLabel className="text-xs text-gray-500">
                              Excluded Days (No slots will be created)
                           </FormLabel>
                           <div className="grid grid-cols-3 gap-2">
                              {DAYS_OF_WEEK.map((day) => (
                                 <div
                                    key={day}
                                    className="flex items-center space-x-2"
                                 >
                                    <Switch
                                       id={`exclude-${day}`}
                                       checked={form
                                          .watch('excludedDays')
                                          ?.includes(day)}
                                       onCheckedChange={(checked) =>
                                          handleDayChange(checked, day)
                                       }
                                    />
                                    <label
                                       htmlFor={`exclude-${day}`}
                                       className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                       {day}
                                    </label>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  <DialogFooter>
                     <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {initialData ? 'Update Hall' : 'Create Hall'}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
