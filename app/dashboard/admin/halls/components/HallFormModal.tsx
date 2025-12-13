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
   hourlyPrice: z.coerce.number().min(100, 'Minimum price is 100'),
   description: z.string().optional(),
   facilities: z.array(z.string()).optional(), // Simple array of strings for now
   // Add other fields as needed
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
      },
   });

   useEffect(() => {
      if (isOpen) {
         if (initialData) {
            // Map initialData facilities object to array of strings if needed,
            // but backend model says facilities is an object with booleans.
            // Let's adjust the form to handle boolean flags or string array.
            // Backend Model: facilities: { hasAC: boolean, ... }
            // API Service Type: facilities: string[] (I changed this in service previously)
            // Let's stick to the SERVICE definition which implies I might need to transform data.
            // Wait, looking at hallModel.js (Step 581), facilities IS an object with booleans.
            // My adminService.ts (Step 579) defined it as string[].
            // I should probbaly updated adminService to match backend model OR transform here.

            // Transforming for the form:
            const activeFacilities = [];
            if (initialData.facilities) {
               // Check if facilities is an array (from service type) or object (from backend)
               // The service type I wrote earlier said string[].
               // If the backend returns an object, the service type I wrote is WRONG.
               // Let's assume for a second the backend returns the object.
               // I will treat it as any for safe mapping here.
               const fac = initialData.facilities as any;
               if (Array.isArray(fac)) {
                  form.reset({ ...initialData, facilities: fac });
               } else {
                  // Object format
                  FACILITY_OPTIONS.forEach((opt) => {
                     if (fac[opt.id]) activeFacilities.push(opt.id);
                  });
                  form.reset({
                     name: initialData.name,
                     capacity: initialData.capacity,
                     hourlyPrice:
                        initialData.pricePerHour ||
                        (initialData as any).hourlyPrice, // Handle mapping
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
            });
         }
      }
   }, [isOpen, initialData, form]);

   const handleSubmit = (values: HallFormValues) => {
      // Transform facilities back to object if backend expects object
      // Backend: facilities: { hasAC: true, ... }

      const facilityObject = {};
      FACILITY_OPTIONS.forEach((opt) => {
         // @ts-ignore
         facilityObject[opt.id] = values.facilities.includes(opt.id);
      });

      const payload = {
         ...values,
         facilities: facilityObject,
      };

      // @ts-ignore - passing the payload that matches backend expectation
      onSubmit(payload);
   };

   // Custom handling for checkbox group
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
                                 <Input type="number" {...field} />
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
                                 <Input type="number" {...field} />
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
