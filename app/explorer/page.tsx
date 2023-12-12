import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { getCourses } from "../courses/course.query";
import { CourseCard } from "../courses/CourseCard";

const CoursesList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const page = Number(searchParams.page ?? 0);
  const courses = await getCourses({ coursePage: page });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Explorer</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </LayoutContent>
    </Layout>
  );
};

export default CoursesList;
