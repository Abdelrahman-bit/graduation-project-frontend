'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const slotSchema = z.object({
   startTime: z.string().min(1, 'Start time is required'),
   endTime: z.string().min(1, 'End time is required'),
});

type SlotFormValues = z.infer<typeof slotSchema>;

interface SlotAddModalProps {
   isOpen: boolean;
   onClose: () => void;
   onAdd: (startTime: string, endTime: string) => void;
   date: Date | null;
   isLoading: boolean;
}

export const SlotAddModal: React.FC<SlotAddModalProps> = ({
   isOpen,
   onClose,
   onAdd,
   date,
   isLoading,
}) => {
   const form = useForm<SlotFormValues>({
      resolver: zodResolver(slotSchema),
      defaultValues: {
         startTime: '',
         endTime: '',
      },
   });

   useEffect(() => {
      if (isOpen && date) {
         try {
            // Default to hour clicked, +1 hour duration
            const startStr = format(date, 'HH:mm');
            const endDate = new Date(date);
            endDate.setHours(endDate.getHours() + 1);
            const endStr = format(endDate, 'HH:mm');

            form.reset({
               startTime: startStr,
               endTime: endStr,
            });
         } catch (e) {
            console.error('Invalid date format for slot', date);
         }
      }
   }, [isOpen, date, form]);

   const handleSubmit = (values: SlotFormValues) => {
      if (!date) return;

      const [startH, startM] = values.startTime.split(':').map(Number);
      const [endH, endM] = values.endTime.split(':').map(Number);

      const newStart = new Date(date);
      newStart.setHours(startH, startM, 0, 0);

      const newEnd = new Date(date);
      newEnd.setHours(endH, endM, 0, 0);

      onAdd(newStart.toISOString(), newEnd.toISOString());
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
               <DialogTitle>Add New Slot</DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
               >
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

                  <DialogFooter>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add Slot
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
