/* eslint-disable @next/next/no-img-element */
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredAuthSession } from "@/lib/auth";
import { PaginationButton } from "../../../../../src/features/pagination/PaginationButton";
import { getCourseLessons } from "./adminLessons.query";
import { AdminLessonItem } from "./AdminLessonItem";

export default async function CourseLessonPage({
  params,
  searchParams,
}: {
  params: {
    courseId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page ?? 0);

  const session = await getRequiredAuthSession();

  const course = await getCourseLessons({
    courseId: params.courseId,
    userId: session.user.id,
    lessonPage: page,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{course?.name}</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>{`${course?._count.lessons ?? 0} lessons`}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {course?.lessons?.map((lesson) => (
              <AdminLessonItem key={lesson.id} lesson={lesson} />
            ))}
            <PaginationButton
              baseUrl={`/admin/courses/${course?.id}/lessons`}
              page={page}
              totalPage={Math.floor((course?._count?.lessons ?? 0) / 10)}
            />
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
