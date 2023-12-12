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
          id: true,
          name: true,
          image: true,
        },
      },
    },
    take: 6,
    skip: Math.max(0, coursePage * 6),
  });

  return courses;
};

export type CoursesCard = Prisma.PromiseReturnType<typeof getCourses>[number];
