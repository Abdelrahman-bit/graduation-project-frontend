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
import { Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const slotSchema = z.object({
   startTime: z.string().min(1, 'Start time is required'),
   endTime: z.string().min(1, 'End time is required'),
});

type SlotFormValues = z.infer<typeof slotSchema>;

interface SlotEditModalProps {
   isOpen: boolean;
   onClose: () => void;
   onUpdate: (id: string, startTime: string, endTime: string) => void;
   onDelete: (id: string) => void;
   slot: any; // Using any for flexibility if slot object shape varies slightly
   isLoading: boolean;
}

export const SlotEditModal: React.FC<SlotEditModalProps> = ({
   isOpen,
   onClose,
   onUpdate,
   onDelete,
   slot,
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
      if (isOpen && slot) {
         try {
            form.reset({
               startTime: format(new Date(slot.startTime), 'HH:mm'),
               endTime: format(new Date(slot.endTime), 'HH:mm'),
            });
         } catch (e) {
            console.error('Invalid date format for slot', slot);
         }
      }
   }, [isOpen, slot, form]);

   const handleSubmit = (values: SlotFormValues) => {
      if (!slot?._id) return;
      // We need to pass full Date strings to backend, but usually for single day slot
      // we maintain the original date part.
      const originalDate = new Date(slot.startTime);
      const [startH, startM] = values.startTime.split(':').map(Number);
      const [endH, endM] = values.endTime.split(':').map(Number);

      const newStart = new Date(originalDate);
      newStart.setHours(startH, startM, 0, 0);

      const newEnd = new Date(originalDate);
      newEnd.setHours(endH, endM, 0, 0);

      onUpdate(slot._id, newStart.toISOString(), newEnd.toISOString());
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
               <DialogTitle>Edit Slot</DialogTitle>
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

                  <DialogFooter className="flex justify-between sm:justify-between w-full">
                     <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(slot._id)}
                        disabled={isLoading}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                     <div className="flex gap-2">
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
                           Save Changes
                        </Button>
                     </div>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};
