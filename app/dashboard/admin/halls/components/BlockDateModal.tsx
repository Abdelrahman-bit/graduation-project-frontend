'use client';

import React, { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface BlockDateModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (date: string) => void;
   isLoading: boolean;
}

export const BlockDateModal: React.FC<BlockDateModalProps> = ({
   isOpen,
   onClose,
   onConfirm,
   isLoading,
}) => {
   const [date, setDate] = useState<Date | undefined>(new Date());

   const handleConfirm = () => {
      if (date) {
         onConfirm(format(date, 'yyyy-MM-dd'));
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Block Date
               </DialogTitle>
               <DialogDescription>
                  Select a date to block out. This will{' '}
                  <strong>delete all available slots</strong> for that day.
                  <br />
                  <span className="text-destructive font-medium mt-1 block">
                     This action cannot be undone.
                  </span>
               </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-4">
               <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-md border shadow"
               />
            </div>

            <DialogFooter className="flex justify-between sm:justify-end gap-2">
               <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button
                  variant="destructive"
                  onClick={handleConfirm}
                  disabled={!date || isLoading}
               >
                  {isLoading && (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Block Date
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
