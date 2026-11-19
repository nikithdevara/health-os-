import { useRole } from "@/lib/RoleContext";
import MemberHome from "./MemberHome";
import DoctorHome from "./DoctorHome";
import HospitalHome from "./HospitalHome";
import LabHome from "./LabHome";
import PharmacyHome from "./PharmacyHome";
import EmergencyHome from "./EmergencyHome";
import AdminHome from "./AdminHome";

const BY_ROLE = {
  member: MemberHome,
  doctor: DoctorHome,
  hospital: HospitalHome,
  lab: LabHome,
  pharmacy: PharmacyHome,
  emergency: EmergencyHome,
  superadmin: AdminHome,
};

export default function RoleHome() {
  const { role } = useRole();
  const Home = BY_ROLE[role] || MemberHome;
  return <Home />;
}