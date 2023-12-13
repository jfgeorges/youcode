import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { getCourses } from "./courses.query";
import { CourseCard } from "../courses/CourseCard";
import { PaginationButton } from "@/features/pagination/PaginationButton";
import { getAuthSession } from "@/lib/auth";
import { NotAuthenticatedCard } from "@/features/errors/NotAuthenticatedCard";

const UserCoursesList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();

  if (!session?.user.id) {
    return <NotAuthenticatedCard />;
  }

  const page = Number(searchParams.page ?? 0);
  const courses = await getCourses({
    userId: session.user.id,
    coursePage: page,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>My courses</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        <div className="col-span-full">
          <PaginationButton
            baseUrl={`/courses`}
            page={page}
            totalPage={Math.floor((courses.length ?? 0) / 10)}
          />
        </div>
      </LayoutContent>
    </Layout>
  );
};

export default UserCoursesList;
