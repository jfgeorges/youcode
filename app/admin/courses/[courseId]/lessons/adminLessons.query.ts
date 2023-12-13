import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCourseLessons = async ({
  courseId,
  userId,
  lessonPage,
}: {
  courseId: string;
  userId: string;
  lessonPage: number;
}) => {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
      creatorId: userId,
    },
    select: {
      id: true,
      name: true,
      lessons: {
        take: 10,
        skip: Math.max(0, lessonPage * 10),
        orderBy: {
          rank: "asc",
        },
        select: {
          id: true,
          courseId: true,
          name: true,
          rank: true,
          state: true,
          content: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });
};

export type AdminLessonItemType = NonNullable<
  Prisma.PromiseReturnType<typeof getCourseLessons>
>["lessons"][number];
