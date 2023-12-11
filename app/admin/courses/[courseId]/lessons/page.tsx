/* eslint-disable @next/next/no-img-element */
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { getRequiredAuthSession } from "@/lib/auth";
import Link from "next/link";
import { PaginationButton } from "../../../../../src/features/pagination/PaginationButton";
import { getCourseLessons } from "./courseLessons.query";
import { Badge } from "@/components/ui/badge";

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
          <CardContent>
            <Table>
              <TableHeader>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">State</TableHead>
              </TableHeader>
              <TableBody className="">
                {course?.lessons?.map((lesson) => (
                  <TableRow
                    key={lesson.id}
                    className="transition-colors hover:bg-accent"
                  >
                    <TableCell>
                      <Typography
                        as={Link}
                        variant="large"
                        href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                      >
                        {lesson.name}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge>{lesson.state}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
