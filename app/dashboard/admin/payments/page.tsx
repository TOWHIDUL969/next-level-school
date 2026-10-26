import { requireAdmin } from "@/lib/auth";
import PaymentsPage from "@/components/admin/PaymentsPage";

export default async function AdminPaymentsPage() {
  await requireAdmin();

  return <PaymentsPage />;
}