import { requireAdmin } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  await requireAdmin();

  return <AdminDashboard />;
}