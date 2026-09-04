import { StudentDetailPage } from "@/features/students/pages";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: StudentDetailPageProps) {
  const { id } = await params;
  return <StudentDetailPage studentId={id} />;
}