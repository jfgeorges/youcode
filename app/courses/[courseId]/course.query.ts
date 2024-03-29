import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getCourse = async ({
  courseId,
  userId = "-",
}: {
  courseId: string;
  userId?: string;
}) => {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      presentation: true,
      users: {
        where: { userId },
        select: {
          canceledAt: true,
          id: true,
        },
      },
      lessons: {
        where: {
          state: {
            in: ["PUBLIC", "PUBLISHED"],
          },
        },
        orderBy: { rank: "asc" },
        select: {
          id: true,
          courseId: true,
          name: true,
          state: true,
          users: {
            where: {
              userId,
            },
            select: {
              progress: true,
            },
          },
        },
      },
      creator: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const lessons = course.lessons.map((lesson) => {
    const progress = lesson.users[0]?.progress ?? "NOT_STARTED";
    return {
      ...lesson,
      progress,
    };
  });

  return {
    ...course,
    isEnrolled: course.users.length > 0 && !course.users[0].canceledAt,
    isCanceled: course.users.length > 0 && !!course.users[0].canceledAt,
    lessons,
  };
};

export type CourseType = NonNullable<
  Prisma.PromiseReturnType<typeof getCourse>
>;

export type CourseLessonItem = CourseType["lessons"][number];
