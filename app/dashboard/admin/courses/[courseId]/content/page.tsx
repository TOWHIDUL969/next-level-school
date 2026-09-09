import ModuleManager from "@/components/admin/courses/moduleManager";
import { requireAdmin } from "@/lib/auth";


interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseContentPage({
  params,
}: PageProps) {
  await requireAdmin();

  const { courseId } = await params;

  return <ModuleManager courseId={courseId} />;
}