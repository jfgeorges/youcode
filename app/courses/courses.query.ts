import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getCourses = async ({
  userId,
  coursePage,
}: {
  userId?: string;
  coursePage: number;
}) => {
  const courses = await prisma.course.findMany({
    where: userId
      ? {
          users: {
            some: {
              userId,
              canceledAt: null,
            },
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      image: true,
      presentation: true,
      creator: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    take: 10,
    skip: Math.max(0, coursePage * 10),
  });

  return courses;
};

export type CoursesCard = Prisma.PromiseReturnType<typeof getCourses>[number];
