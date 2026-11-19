import {
  LayoutDashboard,
  Activity,
  LineChart,
  FileText,
  Pill,
  CalendarDays,
  QrCode,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  Users,
  Stethoscope,
  FlaskConical,
  Building2,
  Siren,
  ShieldAlert,
  ClipboardList,
  Image as ImageIcon,
} from "lucide-react";

export const ROLE_LIST = ["member", "doctor", "hospital", "lab", "pharmacy", "emergency", "superadmin"];

export const ROLES = {
  member: {
    id: "member",
    label: "Member",
    workspace: "Personal health",
    name: "Amara Okafor",
    initials: "AO",
    nav: [
      {
        group: "Health",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Health monitor", to: "/member/vitals", icon: Activity },
          { label: "Health timeline", to: "/member/timeline", icon: LineChart },
          { label: "Medical records", to: "/member/records", icon: FileText },
          { label: "Medications", to: "/member/medications", icon: Pill },
          { label: "Appointments", to: "/member/appointments", icon: CalendarDays },
        ],
      },
      {
        group: "Identity & trust",
        items: [
          { label: "ORVA ID", to: "/member/identity", icon: QrCode },
          { label: "Access & consent", to: "/member/consent", icon: ShieldCheck },
          { label: "AI assistant", to: "/member/assistant", icon: Sparkles },
        ],
      },
    ],
    mobileTabs: [
      { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
      { label: "Timeline", to: "/member/timeline", icon: LineChart },
      { label: "Records", to: "/member/records", icon: FileText },
      { label: "ORVA ID", to: "/member/identity", icon: QrCode },
      { label: "Consent", to: "/member/consent", icon: ShieldCheck },
    ],
  },
  doctor: {
    id: "doctor",
    label: "Doctor",
    workspace: "Clinical workspace",
    name: "Dr. Elias Mensah",
    initials: "EM",
    nav: [
      {
        group: "Clinical",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Patients", to: "/doctor/patients", icon: Users },
          { label: "Consultations", to: "/doctor/consultations", icon: Stethoscope, soon: true },
          { label: "Orders & results", to: "/doctor/orders", icon: ClipboardList, soon: true },
          { label: "Imaging", to: "/doctor/imaging", icon: ImageIcon, soon: true },
        ],
      },
      {
        group: "Intelligence",
        items: [{ label: "Clinical AI review", to: "/doctor/ai", icon: Sparkles, soon: true }],
      },
    ],
    mobileTabs: [
      { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
      { label: "Patients", to: "/doctor/patients", icon: Users },
    ],
  },
  hospital: {
    id: "hospital",
    label: "Hospital admin",
    workspace: "Organisation operations",
    name: "St. Cordelia Hospital",
    initials: "SC",
    nav: [
      {
        group: "Operations",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Staff directory", to: "/hospital/staff", icon: Users, soon: true },
          { label: "Admissions", to: "/hospital/admissions", icon: Building2, soon: true },
          { label: "Appointments", to: "/hospital/appointments", icon: CalendarDays, soon: true },
        ],
      },
      {
        group: "Governance",
        items: [
          { label: "Access governance", to: "/hospital/access", icon: ShieldCheck, soon: true },
          { label: "Audit logs", to: "/hospital/audit", icon: FileText, soon: true },
        ],
      },
    ],
    mobileTabs: [{ label: "Overview", to: "/", icon: LayoutDashboard, exact: true }],
  },
  lab: {
    id: "lab",
    label: "Lab staff",
    workspace: "Diagnostic laboratory",
    name: "Meridian Diagnostics",
    initials: "MD",
    nav: [
      {
        group: "Laboratory",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Test orders", to: "/lab/orders", icon: FlaskConical, soon: true },
          { label: "Sample tracking", to: "/lab/samples", icon: Activity, soon: true },
          { label: "Result validation", to: "/lab/results", icon: ClipboardList, soon: true },
          { label: "Quality control", to: "/lab/quality", icon: ShieldCheck, soon: true },
        ],
      },
    ],
    mobileTabs: [{ label: "Overview", to: "/", icon: LayoutDashboard, exact: true }],
  },
  pharmacy: {
    id: "pharmacy",
    label: "Pharmacy staff",
    workspace: "Medication services",
    name: "CarePoint Pharmacy",
    initials: "CP",
    nav: [
      {
        group: "Pharmacy",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Prescriptions", to: "/pharmacy/prescriptions", icon: ClipboardList, soon: true },
          { label: "Inventory", to: "/pharmacy/inventory", icon: Pill, soon: true },
          { label: "Batches & expiry", to: "/pharmacy/batches", icon: Activity, soon: true },
          { label: "Audit history", to: "/pharmacy/audit", icon: FileText, soon: true },
        ],
      },
    ],
    mobileTabs: [{ label: "Overview", to: "/", icon: LayoutDashboard, exact: true }],
  },
  emergency: {
    id: "emergency",
    label: "Emergency",
    workspace: "Emergency access",
    name: "St. Cordelia ED",
    initials: "ED",
    nav: [
      {
        group: "Emergency",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Emergency access", to: "/emergency/access", icon: Siren },
          { label: "Access history", to: "/emergency/history", icon: FileText, soon: true },
        ],
      },
    ],
    mobileTabs: [
      { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
      { label: "Emergency access", to: "/emergency/access", icon: Siren },
    ],
  },
  superadmin: {
    id: "superadmin",
    label: "Super admin",
    workspace: "Platform governance",
    name: "ORVA Platform",
    initials: "OR",
    nav: [
      {
        group: "Platform",
        items: [
          { label: "Overview", to: "/", icon: LayoutDashboard, exact: true },
          { label: "Organisations", to: "/admin/organisations", icon: Building2, soon: true },
          { label: "Global audit", to: "/admin/audit", icon: FileText, soon: true },
          { label: "Security monitoring", to: "/admin/security", icon: ShieldAlert, soon: true },
          { label: "Policies", to: "/admin/policies", icon: HeartPulse, soon: true },
        ],
      },
    ],
    mobileTabs: [{ label: "Overview", to: "/", icon: LayoutDashboard, exact: true }],
  },
};

export const roleConfig = (role) => ROLES[role] || ROLES.member;

export const ROLE_OPTIONS = ROLE_LIST.map((id) => ({
  id,
  label: ROLES[id].label,
  workspace: ROLES[id].workspace,
}));