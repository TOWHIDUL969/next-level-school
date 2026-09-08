import UserDashboard from "@/components/dashboard/UserDashboard";
import { requireUser } from "@/lib/auth";


export default async function DashboardPage() {
  const user = await requireUser();

  return <UserDashboard user={user} />;
}