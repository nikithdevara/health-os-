import { useState } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { key: "systolic", label: "Systolic", unit: "mmHg", min: 80, max: 200 },
  { key: "diastolic", label: "Diastolic", unit: "mmHg", min: 50, max: 130 },
  { key: "restingHr", label: "Resting heart rate", unit: "bpm", min: 40, max: 160 },
  { key: "spo2", label: "Oxygen saturation", unit: "%", min: 70, max: 100 },
  { key: "weight", label: "Weight", unit: "kg", min: 30, max: 220, step: "0.1" },
];

const EMPTY = { systolic: "", diastolic: "", restingHr: "", spo2: "", weight: "" };

export default function LogReadingDialog({ open, onOpenChange, onSave }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function submit(e) {
    e.preventDefault();
    const next = {};
    FIELDS.forEach((f) => {
      const raw = values[f.key];
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num)) next[f.key] = "Required";
      else if (num < f.min || num > f.max) next[f.key] = `Must be ${f.min}–${f.max}`;
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({
      systolic: Number(values.systolic),
      diastolic: Number(values.diastolic),
      restingHr: Number(values.restingHr),
      spo2: Number(values.spo2),
      weight: Number(values.weight),
    });
    setValues(EMPTY);
    setErrors({});
    onOpenChange(false);
    toast.success("Reading saved", { description: "Your manual vitals are now part of your health record." });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-[19px] font-bold tracking-[-0.02em]">Log a reading</DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Manually recorded values are labelled as self-reported in your timeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.key === "weight" ? "col-span-2" : ""}>
                <Label htmlFor={f.key} className="text-[11.5px] font-semibold text-brand-ink">
                  {f.label} <span className="font-normal text-brand-subtle">({f.unit})</span>
                </Label>
                <Input
                  id={f.key}
                  type="number"
                  step={f.step || "1"}
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className={`mt-1 h-9 text-[13px] ${errors[f.key] ? "border-brand-crit" : ""}`}
                  placeholder={String(f.min)}
                />
                {errors[f.key] && <p className="mt-1 text-[10.5px] text-brand-crit">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
            </Button>
            <Button type="submit" size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Save reading
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}