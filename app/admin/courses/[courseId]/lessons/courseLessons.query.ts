import { prisma } from "@/lib/prisma";

export const getCourseLessons = async ({
  courseId,
  userId,
  lessonPage,
}: {
  courseId: string;
  userId: string;
  lessonPage: number;
}) => {
  const courseLessons = await prisma.course.findUnique({
    where: {
      creatorId: userId,
      id: courseId,
    },
    select: {
      id: true,
      name: true,
      lessons: {
        take: 10,
        skip: Math.max(0, lessonPage * 10),
        select: {
          id: true,
          name: true,
          rank: true,
          content: true,
          state: true,
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

  return courseLessons;
};
