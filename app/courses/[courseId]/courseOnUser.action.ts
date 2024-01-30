"use server";

import { ServerError, authenticatedAction } from "@/lib/action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CourseOnUserActionEditProps = z.object({
  courseId: z.string(),
});

export const courseOnUserActionCreate = authenticatedAction(
  CourseOnUserActionEditProps,
  async (props, { userId }) => {
    // Check if course exists
    const course = await prisma.course.findFirst({
      where: { id: props.courseId },
      include: { lessons: { orderBy: { rank: "asc" } } },
    });

    if (!course) {
      throw new ServerError("This course doesn't exist");
    }

    const allreadyMember = await prisma.courseOnUser.findFirst({
      where: { courseId: props.courseId, userId },
    });
    if (allreadyMember) {
      return {
        message: `You're already member of this course`,
        course,
      };
    }
    const courseOnUser = await prisma.courseOnUser.create({
      data: { courseId: props.courseId, userId },
    });

    return {
      message: `You've just joined the course`,
      course,
    };
  }
);
