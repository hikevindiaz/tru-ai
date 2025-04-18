"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppointmentStatus } from "@/lib/api/appointments";
import type { AppointmentInput, Calendar } from "@/lib/api/appointments";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AppointmentInput) => Promise<void>;
  calendars: Calendar[];
  initialCalendarId: string | null;
}

const defaultNewAppointmentState: AppointmentInput = {
  clientName: "",
  clientPhoneNumber: "",
  description: "",
  date: new Date().toISOString().split('T')[0],
  startTime: "09:00",
  endTime: "10:00",
  status: AppointmentStatus.PENDING,
  color: "indigo",
  calendarId: null,
};

export function CreateAppointmentDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  calendars,
  initialCalendarId
}: CreateAppointmentDialogProps) {
  const [newAppointment, setNewAppointment] = useState<AppointmentInput>(defaultNewAppointmentState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNewAppointment({
        ...defaultNewAppointmentState,
        calendarId: initialCalendarId
      });
      setError(null);
      setIsSubmitting(false);
    }
  }, [open, initialCalendarId]);

  const handleInputChange = (field: keyof AppointmentInput, value: string | null) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!newAppointment.clientName || !newAppointment.date || !newAppointment.startTime || !newAppointment.endTime) {
      setError("Please fill in all required fields (Client Name, Date, Start Time, End Time).");
      return;
    }
    if (!newAppointment.calendarId) {
      setError("Please select a calendar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = { 
        ...newAppointment, 
        status: newAppointment.status ?? AppointmentStatus.PENDING 
      };
      await onSubmit(dataToSend);
    } catch (err) {
      console.error("Submission error in dialog:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-none overflow-y-visible">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Add a new appointment to your calendar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="calendarId" className="text-sm font-medium">
              Calendar <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={newAppointment.calendarId ?? ""} 
              onValueChange={(value) => handleInputChange('calendarId', value)}
              disabled={isSubmitting || calendars.length === 0}
            >
              <SelectTrigger id="calendarId">
                <SelectValue placeholder={calendars.length > 0 ? "Select a calendar" : "No calendars available"} />
              </SelectTrigger>
              <SelectContent>
                {calendars.map(cal => (
                  <SelectItem key={cal.id} value={cal.id}>{cal.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {calendars.length === 0 && <p className="text-xs text-gray-500">You need to create a calendar first.</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Client Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientName"
              type="text"
              value={newAppointment.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Enter client's full name"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="clientPhoneNumber" className="text-sm font-medium">
              Client Phone <span className="text-xs text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="clientPhoneNumber"
              type="tel"
              value={newAppointment.clientPhoneNumber}
              onChange={(e) => handleInputChange('clientPhoneNumber', e.target.value)}
              placeholder="Enter client's phone number"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newAppointment.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Meeting description"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newAppointment.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newAppointment.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                id="endTime"
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newAppointment.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="color" className="text-sm font-medium">
              Color
            </label>
            <Select 
              value={newAppointment.color} 
              onValueChange={(value) => handleInputChange('color', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="sky">Sky</SelectItem>
                <SelectItem value="emerald">Emerald</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="indigo">Indigo</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 