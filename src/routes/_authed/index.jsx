import { createFileRoute } from "@tanstack/react-router";
import RoleHome from "@/components/dashboards/RoleHome";

export const Route = createFileRoute("/_authed/")({
  head: () => ({
    meta: [
      { title: "HealthOS — Health overview" },
      { name: "description", content: "Your HealthOS workspace: health overview, records and consent in one place." },
    ],
  }),
  component: RoleHome,
});