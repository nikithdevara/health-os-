import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { careTeam } from "@/lib/data/orva";

const DOCTORS = careTeam.filter((c) => c.role !== "Hospital");

export default function AppointmentRequestDialog({ open, onOpenChange, onBook }) {
  const [clinician, setClinician] = useState(DOCTORS[0]?.name || "");
  const [mode, setMode] = useState("In person");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:30");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!clinician) next.clinician = "Choose a clinician";
    if (!date) next.date = "Choose a date";
    else if (new Date(`${date}T00:00:00Z`) < new Date(new Date().toISOString().slice(0, 10))) {
      next.date = "Choose a date in the future";
    }
    if (!reason.trim()) next.reason = "Tell the clinician why you are booking";
    setErrors(next);
    if (Object.keys(next).length) return;
    const doctor = DOCTORS.find((d) => d.name === clinician);
    onBook({
      id: `ap-${Date.now()}`,
      clinician,
      speciality: doctor?.role || "Care team",
      org: doctor?.org || "Mercy Grace Clinic",
      date,
      time,
      mode,
      reason: reason.trim(),
      status: "Confirmed",
    });
    setReason("");
    setDate("");
    setErrors({});
    onOpenChange(false);
    toast.success("Appointment confirmed", { description: `${clinician} · ${date} at ${time}.` });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-[19px] font-bold tracking-[-0.02em]">Request an appointment</DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Your care team sees the reason you provide. Nothing else is shared until you consent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label className="text-[11.5px] font-semibold">Clinician</Label>
            <Select value={clinician} onValueChange={setClinician}>
              <SelectTrigger className="mt-1 h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCTORS.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name} · {d.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11.5px] font-semibold">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1 h-9 text-[13px] ${errors.date ? "border-brand-crit" : ""}`}
              />
              {errors.date && <p className="mt-1 text-[10.5px] text-brand-crit">{errors.date}</p>}
            </div>
            <div>
              <Label className="text-[11.5px] font-semibold">Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 h-9 text-[13px]" />
            </div>
          </div>
          <div>
            <Label className="text-[11.5px] font-semibold">Format</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="mt-1 h-9 text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In person">In person</SelectItem>
                <SelectItem value="Video">Video consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11.5px] font-semibold">Reason for visit</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="For example: blood pressure review after new readings"
              className={`mt-1 text-[13px] ${errors.reason ? "border-brand-crit" : ""}`}
            />
            {errors.reason && <p className="mt-1 text-[10.5px] text-brand-crit">{errors.reason}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <CalendarPlus className="mr-1.5 h-3.5 w-3.5" /> Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}