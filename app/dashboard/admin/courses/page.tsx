import CourseTable from "@/components/admin/courses/coursesTable";
import { requireAdmin } from "@/lib/auth";


export default async function AdminCoursesPage() {
  await requireAdmin();

  return <CourseTable />;
}