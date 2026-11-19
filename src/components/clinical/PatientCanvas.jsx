import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Heart,
  Brain,
  Activity,
  Calendar,
  FlaskConical,
  FileText,
  ChevronDown,
  ChevronUp,
  Maximize2,
  SlidersHorizontal,
  Minus,
  Pill,
  Moon,
  Clock,
  Sparkles,
  Stethoscope,
  Microscope,
  Eye,
  Check,
  X,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Move3d,
  ArrowRight,
  ShieldCheck,
  Printer,
  Download
} from "lucide-react";
import { NotesPanel, DocumentsPanel, LabsPanel, ImagingPanel } from "@/components/clinical/PatientPanels";
import { patients as MOCK_PATIENTS, clinicalNotes, records, timeline } from "@/lib/data/orva";
import {
  CardiacMri2x2Grid,
  CardiacMriHLA,
  CardiacMriShortAxis,
  CardiacMriVLA,
  CardiacMriCoronal,
} from "@/components/clinical/MedicalImages";

// ================= CONSTANT FULL-LENGTH MUSCULAR ANATOMY HOTSPOTS =================
const ANATOMY_HOTSPOTS = {
  head: { id: "head", label: "Head & Neurological", count: 1, icon: Brain, top: "7.5%", left: "50%", x: 120, y: 38 },
  heart: { id: "heart", label: "Cardiovascular System", count: 9, icon: Heart, top: "27%", left: "57%", x: 137, y: 138 },
  liver: { id: "liver", label: "Liver & Digestive", count: 2, icon: FlaskConical, top: "40%", left: "41%", x: 98, y: 204 },
  abdomen: { id: "abdomen", label: "Abdomen & Renal", count: 3, icon: Stethoscope, top: "49%", left: "52%", x: 125, y: 250 },
  knee: { id: "knee", label: "Knee & Joint", count: 2, icon: Activity, top: "74%", left: "37%", x: 89, y: 377 },
};

// System-specific mock clinical datasets
const SYSTEM_DATA = {
  heart: {
    title: "Cardiovascular System",
    conditions: [
      { id: "c1", name: "Tachycardia" },
      { id: "c2", name: "Bradycardia" },
      { id: "c3", name: "Hypertonia" },
      { id: "c4", name: "Arrhythmia", active: true },
      { id: "c5", name: "Neurological" },
      { id: "c6", name: "Heart Attack" },
      { id: "c7", name: "Coronary Artery Disease" },
    ],
    cardiogram: {
      title: "Cardiogram",
      metric: "62–180",
      unit: "bpm",
      period: "10 – 17 Sep 2022",
      badgeColor: "#E8F84A",
    },
    days: [
      { day: "Mo", dots: [false, true, true, false] },
      { day: "Tu", dots: [false, false, true, true] },
      { day: "We", dots: [true, true, true, false] },
      { day: "Th", dots: [true, true, true, true] },
      { day: "Fr", dots: [false, true, false, false] },
    ],
  },
  head: {
    title: "Neurological System",
    conditions: [
      { id: "n1", name: "Migraine without aura", active: true },
      { id: "n2", name: "Tension headache" },
      { id: "n3", name: "Cervical radiculopathy" },
      { id: "n4", name: "Vertigo episodes" },
      { id: "n5", name: "Concussion follow-up" },
    ],
    cardiogram: {
      title: "Electroencephalogram (EEG)",
      metric: "9.4",
      unit: "Hz Alpha",
      period: "14 – 18 Oct 2023",
      badgeColor: "#38BDF8",
    },
    days: [
      { day: "Mo", dots: [true, false, true, true] },
      { day: "Tu", dots: [true, true, false, false] },
      { day: "We", dots: [false, true, true, true] },
      { day: "Th", dots: [true, false, false, true] },
      { day: "Fr", dots: [true, true, true, false] },
    ],
  },
  liver: {
    title: "Gastrointestinal & Hepatic",
    conditions: [
      { id: "l1", name: "Fatty Liver Grade 1", active: true },
      { id: "l2", name: "Acid Reflux (GERD)" },
      { id: "l3", name: "Elevated ALT / AST" },
      { id: "l4", name: "Gastritis" },
      { id: "l5", name: "Irritable bowel syndrome" },
    ],
    cardiogram: {
      title: "Hepatic Metabolic Output",
      metric: "38",
      unit: "U/L ALT",
      period: "01 – 07 Nov 2024",
      badgeColor: "#F59E0B",
    },
    days: [
      { day: "Mo", dots: [false, false, true, false] },
      { day: "Tu", dots: [false, true, true, false] },
      { day: "We", dots: [true, true, true, false] },
      { day: "Th", dots: [true, false, true, true] },
      { day: "Fr", dots: [false, true, false, true] },
    ],
  },
  abdomen: {
    title: "Renal & Abdominal",
    conditions: [
      { id: "a1", name: "Renal Function Review", active: true },
      { id: "a2", name: "Dyspepsia" },
      { id: "a3", name: "Microscopic Hematuria" },
      { id: "a4", name: "Abdominal wall tension" },
    ],
    cardiogram: {
      title: "Glomerular Filtration Rate",
      metric: "94",
      unit: "mL/min GFR",
      period: "02 – 09 Aug 2023",
      badgeColor: "#10B981",
    },
    days: [
      { day: "Mo", dots: [true, true, false, false] },
      { day: "Tu", dots: [true, true, true, false] },
      { day: "We", dots: [false, true, true, false] },
      { day: "Th", dots: [true, true, true, true] },
      { day: "Fr", dots: [true, false, true, false] },
    ],
  },
  knee: {
    title: "Musculoskeletal & Joint",
    conditions: [
      { id: "k1", name: "Patellar Tendonitis", active: true },
      { id: "k2", name: "Meniscus Strain" },
      { id: "k3", name: "Chondromalacia" },
      { id: "k4", name: "Ligament laxity review" },
    ],
    cardiogram: {
      title: "Joint Range of Motion",
      metric: "128°",
      unit: "Flexion",
      period: "15 – 22 Jan 2024",
      badgeColor: "#84CC16",
    },
    days: [
      { day: "Mo", dots: [false, true, true, false] },
      { day: "Tu", dots: [true, true, true, false] },
      { day: "We", dots: [true, false, false, true] },
      { day: "Th", dots: [true, true, false, true] },
      { day: "Fr", dots: [false, true, true, false] },
    ],
  },
};

export default function PatientCanvas({ patient: initialPatient, patients = MOCK_PATIENTS, tab: controlledTab, onTab: controlledOnTab, panels = {} } = {}) {
  // Active Patient state
  const [patientIndex, setPatientIndex] = useState(0);
  const activePatient = initialPatient || patients[patientIndex] || patients[0];

  // Tab state
  const [internalTab, setInternalTab] = useState("overview");
  const activeTab = controlledTab || internalTab;
  const setActiveTab = controlledOnTab || setInternalTab;

  // Clinical selections
  const [selectedHotspot, setSelectedHotspot] = useState("heart");
  const currentSystem = SYSTEM_DATA[selectedHotspot] || SYSTEM_DATA.heart;
  const [selectedCondition, setSelectedCondition] = useState("c4");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2016");
  const [timelineSpan, setTimelineSpan] = useState(8);

  // Dialog Modal states
  const [modalDetails, setModalDetails] = useState(null);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [newRecordText, setNewRecordText] = useState("");
  const [medicationTimeframe, setMedicationTimeframe] = useState("Weeks");

  // Filter conditions by search
  const visibleConditions = useMemo(() => {
    if (!searchQuery.trim()) return currentSystem.conditions;
    return currentSystem.conditions.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery, currentSystem]);

  return (
    <div className="min-h-screen bg-[#ECEFE9] p-2 sm:p-4 md:p-6 text-[#1A1D1A] font-sans antialiased selection:bg-[#E8F84A] selection:text-black">
      {/* Outer Curved Canvas Card */}
      <div className="mx-auto max-w-[1520px] rounded-[36px] bg-[#EEF2EB] border border-[#DEE3DA] p-3 sm:p-5 md:p-7 shadow-[0_24px_50px_-15px_rgba(30,41,35,0.08)]">

        {/* ================= TOP NAVIGATION BAR ================= */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E1E6DC]">
          
          {/* Avatar stack with '+' button: Clicking an avatar switches patient! */}
          <div className="flex items-center">
            <div className="flex items-center -space-x-2">
              {patients.slice(0, 4).map((p, idx) => {
                const isActive = p.id === activePatient.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPatientIndex(idx)}
                    title={`Switch to ${p.name}`}
                    className={`relative rounded-full transition-all duration-200 ${
                      isActive ? "ring-2 ring-black scale-105 z-10" : "opacity-85 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <div className="h-8 w-8 rounded-full border-2 border-[#EEF2EB] bg-[#18181B] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {p.initials}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button
              type="button"
              onClick={() => setAddRecordOpen(true)}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-white shadow-xs hover:bg-black transition-transform active:scale-95"
              title="Add new patient consultation / entry"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>

            {/* Active Patient Pill Tag */}
            <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#141714] border border-[#DEE3DA]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {activePatient.name} · {activePatient.age}y {activePatient.sex}
            </span>
          </div>

          {/* Center Tabs: Overview, Notes, Documents, Labs, Imaging */}
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
            {["overview", "notes", "documents", "labs", "imaging"].map((key) => {
              const active = activeTab === key;
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#18181B] text-white shadow-sm"
                      : "bg-white text-[#2C332E] hover:bg-[#FAFBF9] border border-[#E2E6DE]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right Search Input */}
          <div className="flex items-center rounded-full bg-white px-3.5 py-1.5 border border-[#DEE3DA] shadow-xs w-48 sm:w-56">
            <Search className="h-3.5 w-3.5 text-[#737F76] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conditions..."
              className="ml-2 w-full bg-transparent text-[11px] text-[#1A1D1A] placeholder:text-[#849187] outline-none"
            />
          </div>
        </header>

        {/* ================= TAB ROUTING OR MAIN CLINICAL OVERVIEW ================= */}
        {activeTab !== "overview" ? (
          <div className="py-5">
            {activeTab === "notes" && <NotesPanel patient={activePatient} clinicalNotes={clinicalNotes} />}
            {activeTab === "documents" && <DocumentsPanel timeline={timeline} onSelectRecord={(r) => setModalDetails({ title: r.title, type: "Document", date: r.date, text: r.summary || r.content })} />}
            {activeTab === "labs" && <LabsPanel records={records} onSelectRecord={(r) => setModalDetails({ title: r.title, type: "Lab Panel", date: r.date, text: r.summary })} />}
            {activeTab === "imaging" && <ImagingPanel patient={activePatient} />}
          </div>
        ) : (
          <>
            {/* ================= MAIN INTERACTIVE BODY & CLINICAL FLOW CANVAS ================= */}
            <div className="relative pt-6 pb-6 overflow-x-auto orva-scroll">
              <div className="min-w-[1080px] grid grid-cols-[250px_210px_minmax(0,1fr)] items-start gap-4">

                {/* 1. LEFT COLUMN: CONSTANT FULL-LENGTH MUSCULAR ANATOMY BODY */}
                <div className="relative flex flex-col items-center justify-center h-[500px] w-[240px] select-none rounded-3xl bg-white/40 border border-[#DEE3DA]/60 p-2 shadow-2xs">
                  {/* Full-Length Muscular Body Image */}
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img
                      src="/muscle_body.png"
                      alt="Constant Full-Length Patient Muscular Anatomy"
                      className="h-full w-auto max-h-[485px] object-contain drop-shadow-[0_8px_24px_rgba(30,20,20,0.14)] pointer-events-none select-none"
                    />

                    {/* Interactive Anatomical Hotspot Badges directly positioned on the body */}
                    {Object.entries(ANATOMY_HOTSPOTS).map(([id, spot]) => {
                      const isSelected = selectedHotspot === id;
                      const Icon = spot.icon;

                      return (
                        <div
                          key={id}
                          style={{
                            position: "absolute",
                            top: spot.top,
                            left: spot.left,
                            transform: "translate(-50%, -50%)",
                            zIndex: isSelected ? 30 : 20,
                          }}
                        >
                          {/* Glowing pulse ring on active hotspot */}
                          {isSelected && (
                            <span className="absolute -inset-2.5 rounded-full bg-[#E8F84A]/60 animate-ping pointer-events-none" />
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedHotspot(id)}
                            className={`group relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "h-11 w-11 bg-[#E8F84A] text-black shadow-[0_4px_22px_rgba(232,248,74,0.85)] ring-4 ring-white scale-110"
                                : "h-8 w-8 bg-white/95 text-[#2C332E] border border-[#D5DCD0] shadow-md hover:scale-110 hover:bg-white"
                            }`}
                            title={`${spot.label} (${spot.count} clinical records)`}
                          >
                            <Icon className={isSelected ? "h-5 w-5" : "h-3.5 w-3.5"} />

                            {/* Numeric Counter Badge on Top Right */}
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold bg-[#18181B] text-white">
                              {spot.count}
                            </span>
                          </button>
                        </div>
                      );
                    })}

                    {/* SVG Bezier Branching Curve from Selected Hotspot to Condition List */}
                    {(() => {
                      const curSpot = ANATOMY_HOTSPOTS[selectedHotspot] || ANATOMY_HOTSPOTS.heart;
                      const sx = curSpot.x;
                      const sy = curSpot.y;

                      return (
                        <svg
                          className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible z-10"
                          aria-hidden="true"
                        >
                          <g fill="none" stroke="#D1D9CD" strokeWidth="1.6">
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 45, 245 45`} />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 95, 245 95`} />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 148, 245 148`} />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 205, 245 205`} stroke="#E8F84A" strokeWidth="2.4" />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 310, 245 310`} />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 360, 245 360`} />
                            <path d={`M ${sx} ${sy} C ${sx + 45} ${sy}, 225 415, 245 415`} />
                          </g>
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* 2. MIDDLE COLUMN: CONDITION BRANCHING LIST */}
                <div className="flex flex-col justify-center space-y-2 z-10 py-4">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-brand-subtle mb-1">
                    {currentSystem.title}
                  </div>

                  {visibleConditions.map((cond, idx) => {
                    const isActive = cond.id === selectedCondition || (!selectedCondition && idx === 3);

                    if (isActive) {
                      return (
                        <div key={cond.id} className="space-y-1.5">
                          {/* Active Yellow Highlighted Pill Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedCondition(cond.id)}
                            className="flex w-full items-center justify-between rounded-full bg-[#E8F84A] px-3.5 py-2 text-[12px] font-bold text-[#141714] shadow-sm hover:brightness-105 transition-all"
                          >
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-[#18181B]" />
                              <span>{cond.name}</span>
                            </span>
                            <div className="flex flex-col -space-y-1 text-[#18181B]/70">
                              <ChevronUp className="h-3 w-3" />
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </button>

                          {/* Expanded Cardiogram Sub-Card */}
                          <div className="rounded-2xl bg-[#18181B] p-3 text-white shadow-md">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                              <span>{currentSystem.cardiogram.title}</span>
                              <span className="text-[#E8F84A] font-bold">{currentSystem.cardiogram.metric} {currentSystem.cardiogram.unit}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
                              
                              {/* Animated ECG Rhythm Wave */}
                              <div className="flex-1 h-7 flex items-center overflow-hidden">
                                <svg viewBox="0 0 120 28" className="w-full h-full stroke-white fill-none stroke-[1.8]">
                                  <path d="M 0 14 L 18 14 L 24 14 L 28 6 L 33 22 L 38 4 L 43 18 L 47 14 L 65 14 L 72 14 L 76 7 L 81 21 L 86 5 L 91 17 L 95 14 L 120 14" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={cond.id}
                        type="button"
                        onClick={() => setSelectedCondition(cond.id)}
                        className="flex w-full items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[11.5px] font-medium text-[#2C332E] border border-[#DEE4DA] shadow-2xs hover:bg-[#FAFBF9] transition-all"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A1ADA3]" />
                        <span className="truncate">{cond.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 3. RIGHT COLUMN: CLINICAL MIND MAP / FLOW NODES (ALL CARDS CLICKABLE) */}
                <div className="relative flex items-center gap-5 min-h-[490px] pl-3">
                  
                  {/* Connecting curve from Arrhythmia to First Node */}
                  <svg className="pointer-events-none absolute -left-5 top-0 h-full w-12 overflow-visible" aria-hidden="true">
                    <path
                      d="M -6 205 C 10 205, 12 120, 28 120"
                      fill="none"
                      stroke="#18181B"
                      strokeWidth="1.8"
                    />
                  </svg>

                  {/* FLOW COLUMN 1 */}
                  <div className="flex flex-col gap-3 w-[180px] shrink-0">
                    {/* Heart Beat Black Card -> Clickable */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Heart Beat Ambulatory Monitor",
                          type: "Cardiac Holter Recording",
                          date: "10 – 17 Sep 2022",
                          text: "Continuous 7-day Holter monitoring revealed episodic sinus tachycardia up to 180 bpm and nocturnal bradycardia down to 62 bpm. Associated with mild palpitations. No pauses > 2.0s.",
                          stat: "62–180 bpm",
                        })
                      }
                      className="relative rounded-3xl bg-[#18181B] p-3.5 text-white shadow-lg cursor-pointer hover:ring-2 hover:ring-[#E8F84A] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F84A] text-black">
                          <FlaskConical className="h-3 w-3" />
                        </span>
                        <div className="leading-tight">
                          <p className="text-[8.5px] uppercase font-bold tracking-wider text-zinc-400">Office visit</p>
                          <p className="text-[11px] font-bold text-white">Heart Beat</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-[17px] font-black tracking-tight leading-none text-white">
                          {currentSystem.cardiogram.metric} <span className="text-[10px] font-semibold text-zinc-400">{currentSystem.cardiogram.unit}</span>
                        </p>
                        <p className="text-[8.5px] text-zinc-400 mt-1">{currentSystem.cardiogram.period}</p>
                      </div>

                      {/* 5-Day Bubble Bar Chart */}
                      <div className="mt-3 flex items-end justify-between px-1 h-12">
                        {currentSystem.days.map((col, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div className="flex flex-col items-center gap-[3px]">
                              {col.dots.map((isYellow, dIdx) => (
                                <span
                                  key={dIdx}
                                  className={`h-2 w-2 rounded-full ${
                                    isYellow ? "bg-[#E8F84A]" : "bg-white/40"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[7.5px] text-zinc-400 font-medium">{col.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* White Card: Lab Results */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Routine Lab Results — Lipid Panel",
                          type: "Diagnostic Chemistry",
                          date: "07.10",
                          text: "Total Cholesterol 4.9 mmol/L, HDL 1.4 mmol/L, LDL 2.9 mmol/L. Electrolytes normal. Liver transaminases stable.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <Calendar className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Lab Results</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>

                    {/* White Card: Lab Results */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Electrolytes & Renal Markers",
                          type: "Metabolic Biochemistry",
                          date: "07.10",
                          text: "Serum Potassium 4.1 mEq/L, Sodium 138 mEq/L, Creatinine 0.9 mg/dL. Within safe bounds.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <FlaskConical className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Lab Results</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>
                  </div>

                  {/* FLOW COLUMN 2 */}
                  <div className="relative flex flex-col gap-3 w-[180px] shrink-0">
                    {/* Connecting curve line from Heart Beat to Heart MRI */}
                    <svg className="pointer-events-none absolute -left-5 top-0 h-full w-6 overflow-visible" aria-hidden="true">
                      <path d="M -8 115 C 4 115, 6 220, 18 220" fill="none" stroke="#18181B" strokeWidth="1.5" />
                    </svg>

                    {/* White Card: Lab Results */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Hematology & Complete Blood Count",
                          type: "Laboratory Report",
                          date: "07.10",
                          text: "Hemoglobin 13.8 g/dL, Platelets 240 x 10^9/L, WBC 6.2 x 10^9/L. No acute anemia or infection identified.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <FlaskConical className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Lab Results</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>

                    {/* Heart MRI Black Card -> Clickable with Procedural Vector MRI Slices */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Contrast-Enhanced Cardiac MRI Study",
                          type: "Radiology Report",
                          date: "Office visit · Sep 2022",
                          text: "Left ventricular ejection fraction is 58%. Normal chamber sizes. No delayed gadolinium enhancement to suggest prior myocardial infarction or myocarditis. Normal valves.",
                          isMri: true,
                        })
                      }
                      className="rounded-3xl bg-[#18181B] p-3 text-white shadow-lg cursor-pointer hover:ring-2 hover:ring-[#E8F84A] transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F84A] text-black">
                          <Heart className="h-3 w-3" />
                        </span>
                        <div className="leading-tight">
                          <p className="text-[8.5px] uppercase font-bold tracking-wider text-zinc-400">Office visit</p>
                          <p className="text-[11px] font-bold text-white">Heart MRI</p>
                        </div>
                      </div>

                      {/* 2x2 Photorealistic Procedural Cardiac MRI Slices (High contrast, true clinical cine) */}
                      <CardiacMri2x2Grid className="mt-1" />
                    </div>

                    {/* White Card: Lab Results */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Microbiology & Urinalysis",
                          type: "Laboratory Screening",
                          date: "07.10",
                          text: "Negative for nitrites and leukocytes. Specific gravity 1.018. Clear sediment.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <Microscope className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Lab Results</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>
                  </div>

                  {/* FLOW COLUMN 3 */}
                  <div className="relative flex flex-col gap-3 w-[190px] shrink-0">
                    {/* Connecting curve line to Heart Note */}
                    <svg className="pointer-events-none absolute -left-5 top-0 h-full w-6 overflow-visible" aria-hidden="true">
                      <path d="M -8 220 C 4 220, 6 90, 18 90" fill="none" stroke="#18181B" strokeWidth="1.5" />
                    </svg>

                    {/* Black Card: Heart Note -> Clickable */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Hospitalization & Inpatient Cardiology Note",
                          type: "Clinical Discharge Summary",
                          date: "Hospitalization Stay 2.01",
                          text: "Patient admitted under observation for atypical palpitations. Echo showed preserved systolic function. Discharged on low-dose beta blocker with outpatient Holter planned.",
                        })
                      }
                      className="rounded-3xl bg-[#18181B] p-3 text-white shadow-lg cursor-pointer hover:ring-2 hover:ring-[#E8F84A] transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F84A] text-black">
                          <FileText className="h-3 w-3" />
                        </span>
                        <div className="leading-tight">
                          <p className="text-[8.5px] uppercase font-bold tracking-wider text-zinc-400">Office visit</p>
                          <p className="text-[11px] font-bold text-white">Heart Note</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-2 flex flex-col items-center text-center">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 mb-1">
                            <Heart className="h-2.5 w-2.5" />
                          </span>
                          <span className="text-[12px] font-extrabold text-white">2.01</span>
                          <span className="text-[7.5px] text-zinc-400 mt-0.5">MRI Note</span>
                          <span className="text-[6.5px] text-zinc-500 uppercase tracking-wider">Hospitalization</span>
                        </div>

                        <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-2 flex flex-col items-center text-center">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 mb-1">
                            <Heart className="h-2.5 w-2.5" />
                          </span>
                          <span className="text-[12px] font-extrabold text-white">MRI Note</span>
                          <span className="text-[6.5px] text-zinc-500 uppercase tracking-wider mt-1">Hospitalization</span>
                        </div>
                      </div>
                    </div>

                    {/* White Card: Wrist MRI */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Wrist MRI Joint Examination",
                          type: "Orthopedic Study",
                          date: "07.10",
                          text: "Scapholunate ligament intact. No occult fracture or tenosynovitis. Normal carpal alignment.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <Stethoscope className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Wrist MRI</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>

                    {/* White Card: Wrist MRI */}
                    <div
                      onClick={() =>
                        setModalDetails({
                          title: "Carpal Tunnel Diagnostic Assessment",
                          type: "Neuromuscular Review",
                          date: "07.10",
                          text: "Median nerve conduction studies show normal distal latency. Mild tendon strain responds to splinting.",
                        })
                      }
                      className="rounded-2xl bg-white p-3 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF0E8] text-[#556157]">
                            <Stethoscope className="h-2.5 w-2.5" />
                          </span>
                          <div>
                            <p className="text-[7.5px] uppercase font-bold text-[#849187]">Office visit</p>
                            <p className="text-[10.5px] font-bold text-[#1A1D1A]">Wrist MRI</p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold text-[#7A877D]">07.10</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ================= HORIZONTAL SCRUBBER TIMELINE ================= */}
            <div className="relative mt-2 pt-3 pb-3 border-t border-[#DEE4DA] flex items-center justify-between gap-4 overflow-x-auto">
              <div className="relative flex-1 flex items-center justify-between px-3 text-[11px] font-semibold text-[#667269]">
                {/* Range highlight bar over active year */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-7 w-36 rounded-full bg-[#E8F84A] shadow-xs z-0 flex items-center justify-around px-3 transition-all duration-300"
                  style={{
                    right: selectedYear === "2016" || selectedYear === "2015" ? "17%" : selectedYear >= "2019" ? "55%" : "8%",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#18181B]" />
                    ))}
                  </div>
                </div>

                {/* Dot row along the track */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-0">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <span key={i} className="h-1 w-1 rounded-full bg-[#D1D9CD]" />
                  ))}
                </div>

                {["2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"].map((year) => {
                  const inHighlight = year === selectedYear || (selectedYear === "2016" && year === "2015");
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setSelectedYear(year)}
                      className={`relative z-10 px-1 py-0.5 transition-colors cursor-pointer ${
                        inHighlight ? "font-extrabold text-[#141714]" : "hover:text-[#18181B]"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>

              {/* Timeline Zoom Buttons: '-' and '+' */}
              <div className="flex items-center gap-1.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setTimelineSpan((s) => Math.min(12, s + 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-white hover:bg-black active:scale-95 transition-all shadow-xs cursor-pointer"
                  title="Expand timeline scale"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTimelineSpan((s) => Math.max(4, s - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-white hover:bg-black active:scale-95 transition-all shadow-xs cursor-pointer"
                  title="Zoom in timeline scale"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ================= BOTTOM THREE FLOATING SUMMARY CARDS ================= */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* CARD 1: MEDICATIONS */}
              <div className="rounded-[28px] bg-white p-4 border border-[#DEE4DA] shadow-xs">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="font-heading text-[14px] font-bold text-[#141714]">Medications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMedicationTimeframe((t) => (t === "Weeks" ? "Months" : "Weeks"))}
                      className="flex items-center gap-1 rounded-full bg-[#EEF2EB] px-2.5 py-1 text-[10px] font-bold text-[#323B34] hover:bg-[#E4EAE0] transition-colors"
                    >
                      <span>{medicationTimeframe}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("documents")}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-white hover:bg-black transition-colors"
                      title="Expand full pharmacy prescriptions"
                    >
                      <Maximize2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>

                {/* Medication pill badges (Clickable) */}
                <div className="flex items-center gap-2 overflow-x-auto orva-scroll pb-1">
                  {/* White Pill: Ibuprofen */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "Ibuprofen Prescription",
                        type: "Anti-Inflammatory NSAID",
                        date: "Dosage: 500 mg oral as needed",
                        text: "Take with food for joint inflammation. Maximum 1500 mg in 24 hours. Prescribed by Dr. Elias Mensah.",
                      })
                    }
                    className="flex items-center gap-2 rounded-full bg-[#EEF2EB] px-3 py-1.5 shrink-0 border border-[#DEE4DA] cursor-pointer hover:border-black transition-all"
                  >
                    <Pill className="h-3.5 w-3.5 text-[#5A685D]" />
                    <div className="leading-tight">
                      <p className="text-[10px] font-bold text-[#141714]">Ibuprofen x 1</p>
                      <p className="text-[8px] text-[#738276]">500 mg</p>
                    </div>
                  </div>

                  {/* Yellow Highlight Pill: Eliquis */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "Eliquis (Apixaban)",
                        type: "Factor Xa Inhibitor (Anticoagulant)",
                        date: "Dosage: 200 mg (2.5 mg bid)",
                        text: "Twice daily with water for atrial fibrillation stroke prevention. Adherence: 98%. Refill active at Meridian Pharmacy.",
                      })
                    }
                    className="flex items-center gap-2 rounded-full bg-[#E8F84A] px-3.5 py-1.5 shrink-0 shadow-xs cursor-pointer hover:brightness-105 transition-all"
                  >
                    <Moon className="h-3.5 w-3.5 text-[#141714]" />
                    <div className="leading-tight">
                      <p className="text-[10px] font-extrabold text-[#141714]">Eliquis x 2</p>
                      <p className="text-[8px] font-semibold text-[#374039]">200 mg</p>
                    </div>
                  </div>

                  {/* White Pill: Ibuprofen */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "Ibuprofen Refill",
                        type: "Secondary Package",
                        date: "Dosage: 500 mg",
                        text: "Backup blister pack dispensed 07.10. Keep in a dry, cool cabinet.",
                      })
                    }
                    className="flex items-center gap-2 rounded-full bg-[#EEF2EB] px-3 py-1.5 shrink-0 border border-[#DEE4DA] cursor-pointer hover:border-black transition-all"
                  >
                    <Moon className="h-3.5 w-3.5 text-[#5A685D]" />
                    <div className="leading-tight">
                      <p className="text-[10px] font-bold text-[#141714]">Ibuprofen x 1</p>
                      <p className="text-[8px] text-[#738276]">500 mg</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: VISITS */}
              <div className="rounded-[28px] bg-white p-4 border border-[#DEE4DA] shadow-xs">
                <div className="flex items-center justify-between pb-3">
                  <h3 className="font-heading text-[14px] font-bold text-[#141714]">Visits</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("notes")}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-white hover:bg-black transition-colors"
                    title="View all consultation visits"
                  >
                    <SlidersHorizontal className="h-2.5 w-2.5" />
                  </button>
                </div>

                {/* Visit timeline blocks (Clickable) */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Highlighted Yellow Visit */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "MRI Chest Consultation Visit",
                        type: "Specialist Appointment",
                        date: "Date: 07.10",
                        text: "Full diagnostic chest MRI scheduled at Meridian Imaging Center. Pre-scan contrast screening completed.",
                      })
                    }
                    className="rounded-2xl bg-[#E8F84A] p-2.5 flex flex-col justify-between shadow-xs cursor-pointer hover:brightness-105 transition-all"
                  >
                    <span className="text-[8px] font-bold text-[#556358]">07.10</span>
                    <div className="mt-2">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-black shrink-0" />
                        <span className="text-[9.5px] font-extrabold text-[#141714] truncate">MRI Chest</span>
                      </div>
                      <span className="text-[7.5px] font-semibold text-[#48544B] block mt-0.5">Office visit</span>
                    </div>
                  </div>

                  {/* Gray Visit: ECG */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "12-Lead Electrocardiogram (ECG)",
                        type: "Diagnostic Visit",
                        date: "Date: 12.10",
                        text: "In-office 12-lead ECG. Sinus rhythm, PR interval 164 ms, QRS duration 88 ms, QTc 418 ms.",
                      })
                    }
                    className="rounded-2xl bg-[#EEF2EB] p-2.5 flex flex-col justify-between border border-[#DEE4DA] cursor-pointer hover:border-black transition-all"
                  >
                    <span className="text-[8px] font-bold text-[#738276]">12.10</span>
                    <div className="mt-2">
                      <span className="text-[9.5px] font-bold text-[#141714] block">ECG</span>
                      <span className="text-[7.5px] text-[#738276] block mt-0.5">Office visit</span>
                    </div>
                  </div>

                  {/* Gray Visit: CITI */}
                  <div
                    onClick={() =>
                      setModalDetails({
                        title: "Thoracic Low-Dose CT Scan",
                        type: "Computed Tomography",
                        date: "Date: 19.10",
                        text: "Chest CT confirmed clear parenchyma without nodule or consolidation. Mediastinum unremarkable.",
                      })
                    }
                    className="rounded-2xl bg-[#EEF2EB] p-2.5 flex flex-col justify-between border border-[#DEE4DA] cursor-pointer hover:border-black transition-all"
                  >
                    <span className="text-[8px] font-bold text-[#738276]">19.10</span>
                    <div className="mt-2">
                      <span className="text-[9.5px] font-bold text-[#141714] block truncate">CITI Scan</span>
                      <span className="text-[7.5px] text-[#738276] block mt-0.5">Office visit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: LABS */}
              <div
                onClick={() => setActiveTab("labs")}
                className="rounded-[28px] bg-white p-4 border border-[#DEE4DA] shadow-xs cursor-pointer hover:border-black transition-all"
              >
                <div className="flex items-center justify-between pb-2">
                  <h3 className="font-heading text-[14px] font-bold text-[#141714]">Labs</h3>
                  <span className="text-[9px] font-semibold text-brand-subtle flex items-center gap-1">
                    View Panel <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <p className="text-[11px] font-bold text-[#141714]">Basic Metabolic</p>
                    <p className="text-[17px] font-black text-[#141714] leading-tight mt-0.5">
                      83 <span className="text-[9.5px] font-semibold text-[#738276]">mg/dL</span>
                    </p>
                  </div>

                  {/* Graduated Bubble Metrics in Yellow & Gray */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-7 w-7 rounded-full bg-[#E8F84A] shadow-xs flex items-center justify-center text-[8px] font-bold text-black">
                      Na
                    </span>
                    <span className="h-5 w-5 rounded-full bg-[#D4DDD0] flex items-center justify-center text-[7px] font-bold text-[#556157]">
                      K
                    </span>
                    <span className="h-3.5 w-3.5 rounded-full bg-[#B8C4B3]" />
                    <span className="h-2 w-2 rounded-full bg-[#18181B]" />
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

      </div>

      {/* ================= MODAL: DIAGNOSTIC CARD DETAILS ================= */}
      {modalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-border">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-brand-subtle">
                  {modalDetails.type}
                </span>
                <h2 className="text-[17px] font-bold text-brand-ink mt-0.5">{modalDetails.title}</h2>
                <p className="text-[11px] text-brand-subtle mt-0.5">{modalDetails.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalDetails(null)}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalDetails.stat && (
              <div className="mt-4 rounded-2xl bg-[#18181B] p-4 text-white">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Telemetry Reading</span>
                <p className="text-2xl font-black text-[#E8F84A] mt-1">{modalDetails.stat}</p>
              </div>
            )}

            {modalDetails.isMri && (
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-black p-2 border border-zinc-800">
                <div className="h-28 bg-[#030406] rounded-xl overflow-hidden border border-zinc-900">
                  <CardiacMriHLA />
                </div>
                <div className="h-28 bg-[#030406] rounded-xl overflow-hidden border border-zinc-900">
                  <CardiacMriShortAxis />
                </div>
                <div className="h-28 bg-[#030406] rounded-xl overflow-hidden border border-zinc-900">
                  <CardiacMriVLA />
                </div>
                <div className="h-28 bg-[#030406] rounded-xl overflow-hidden border border-zinc-900">
                  <CardiacMriCoronal />
                </div>
              </div>
            )}

            <div className="mt-4 rounded-2xl bg-[#EEF2EB] p-4 text-[12.5px] leading-relaxed text-[#2C332E]">
              {modalDetails.text}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalDetails(null)}
                className="rounded-full bg-[#18181B] px-5 py-2 text-[12px] font-bold text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD RECORD / PATIENT ================= */}
      {addRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-brand-ink">Add Clinical Record</h2>
                <p className="text-[11px] text-brand-subtle mt-0.5">Recording entry for {activePatient.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setAddRecordOpen(false)}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-brand-ink block mb-1">Clinical Note / Observation</label>
                <textarea
                  rows={3}
                  value={newRecordText}
                  onChange={(e) => setNewRecordText(e.target.value)}
                  placeholder="Record patient telemetry, medication update, or symptoms..."
                  className="w-full rounded-xl border border-border bg-[#F5F8F4] p-3 text-[12px] outline-none focus:border-black resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-brand-subtle block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    defaultValue={72}
                    className="w-full rounded-xl border border-border bg-[#F5F8F4] px-3 py-2 text-[12px] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-brand-subtle block mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    defaultValue="120/80"
                    className="w-full rounded-xl border border-border bg-[#F5F8F4] px-3 py-2 text-[12px] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddRecordOpen(false)}
                className="rounded-full px-4 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddRecordOpen(false);
                  setNewRecordText("");
                }}
                className="rounded-full bg-[#18181B] px-5 py-2 text-[11.5px] font-bold text-white hover:bg-black"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
