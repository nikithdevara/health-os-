const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2, Minus, Move, Plus, RotateCcw, ScanLine } from "lucide-react";
import { ChestXRayPA } from "@/components/clinical/MedicalImages";

const FINDINGS = [
  { id: "heart", label: "Cardiac silhouette within normal limits", confidence: 94 },
  { id: "lungs", label: "No focal consolidation detected", confidence: 88 },
  { id: "hilar", label: "Mild bilateral hilar prominence", confidence: 61, hasHighlight: true },
];

function Viewfinder({ zoom, offset, onDragStart, compare = false, label, highlightHilar = false }) {
  return (
    <div
      className="relative h-full w-full cursor-grab overflow-hidden rounded-xl bg-[#040608] active:cursor-grabbing border border-border"
      onPointerDown={onDragStart}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-150"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
      >
        <ChestXRayPA
          compare={compare}
          highlightHilar={highlightHilar}
          className="h-full w-full max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>
      <span className="absolute left-2.5 top-2.5 rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
        {label}
      </span>
      {compare && (
        <span className="absolute bottom-2.5 left-2.5 rounded-md bg-brand-warn/90 px-2 py-0.5 text-[10px] font-semibold text-white">
          Previous study · 32 days earlier
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" />
      <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/10" />
    </div>
  );
}

export default function ImagingViewer() {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [compare, setCompare] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [drag, setDrag] = useState(null);
  const [highlightHilar, setHighlightHilar] = useState(false);

  function onDragStart(e) {
    setDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }
  function onDragMove(e) {
    if (!drag) return;
    setOffset({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }

  const controls = (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
      <button
        type="button"
        onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
        className="grid h-7 w-7 place-items-center rounded-md text-brand-ink hover:bg-muted transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
        className="grid h-7 w-7 place-items-center rounded-md text-brand-ink hover:bg-muted transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => {
          setZoom(1);
          setOffset({ x: 0, y: 0 });
        }}
        className="grid h-7 w-7 place-items-center rounded-md text-brand-ink hover:bg-muted transition-colors"
        aria-label="Reset view"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <span className="px-1 text-[10.5px] tnum text-brand-subtle">{Math.round(zoom * 100)}%</span>
    </div>
  );

  return (
    <div
      className="orva-card overflow-hidden"
      onPointerMove={onDragMove}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
        <div>
          <p className="text-[12.5px] font-bold text-brand-ink">Chest radiograph · PA view</p>
          <p className="text-[10.5px] text-brand-subtle">St. Cordelia Hospital · 32 days ago · accession CX-4417</p>
        </div>
        <div className="flex items-center gap-1.5">
          {controls}
          <button
            type="button"
            onClick={() => setCompare((v) => !v)}
            className={`rounded-lg border px-2 py-1 text-[10.5px] font-semibold transition-colors ${
              compare ? "border-primary bg-brand-mint text-brand-forest" : "border-border text-brand-subtle hover:text-brand-ink"
            }`}
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="grid h-7 w-7 place-items-center rounded-md border border-border text-brand-ink hover:bg-muted transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className={`grid gap-0 ${compare ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="h-[248px] p-2">
          <Viewfinder
            zoom={zoom}
            offset={offset}
            onDragStart={onDragStart}
            highlightHilar={highlightHilar}
            label="Current · indexed"
          />
        </div>
        {compare && (
          <div className="h-[248px] p-2 pl-0">
            <Viewfinder
              zoom={1}
              offset={{ x: 0, y: 0 }}
              onDragStart={() => {}}
              compare
              label="Previous study (32d prior)"
            />
          </div>
        )}
      </div>

      <div className="border-t border-border px-3.5 py-3">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-brand-warn">
          <ScanLine className="h-3 w-3" /> Simulated AI findings — demonstration only
        </p>
        <ul className="mt-2 space-y-1.5">
          {FINDINGS.map((f) => (
            <li
              key={f.id}
              onClick={() => {
                if (f.hasHighlight) setHighlightHilar((v) => !v);
              }}
              className={`flex items-center gap-2 rounded-lg p-1 -mx-1 transition-all ${
                f.hasHighlight ? "cursor-pointer hover:bg-muted/60" : ""
              } ${f.hasHighlight && highlightHilar ? "bg-[#E8F84A]/15 ring-1 ring-[#E8F84A]/50" : ""}`}
            >
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-brand-ink flex items-center gap-1.5">
                {f.label}
                {f.hasHighlight && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                    {highlightHilar ? "Click to unhighlight" : "Click to view ROI"}
                  </span>
                )}
              </span>
              <span className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${f.confidence}%` }} />
              </span>
              <span className="w-7 text-right text-[10px] tnum text-brand-subtle">{f.confidence}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-brand-subtle">
          <Move className="h-3 w-3" /> Drag to pan · not a validated diagnostic output
        </p>
      </div>

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-[880px] p-0 overflow-hidden">
          <DialogTitle className="sr-only">Chest radiograph viewer</DialogTitle>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <p className="text-[13px] font-bold text-brand-ink">Chest radiograph · PA view</p>
              <p className="text-[10.5px] text-brand-subtle">St. Cordelia Hospital · Diagnostic PACS</p>
            </div>
            {controls}
          </div>
          <div className="h-[62vh] bg-[#040608] p-2">
            <Viewfinder
              zoom={zoom}
              offset={offset}
              onDragStart={onDragStart}
              highlightHilar={highlightHilar}
              label="Current · indexed"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}