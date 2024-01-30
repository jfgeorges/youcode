"use client";

import { Button } from "@/components/ui/button";
import { courseOnUserActionCreate } from "./courseOnUser.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type JoinCourseButtonProps = { courseId: string };

const JoinCourseButton = (props: JoinCourseButtonProps) => {
  const router = useRouter();
  return (
    <Button
      onClick={async (values) => {
        const { data, serverError } = await courseOnUserActionCreate({
          courseId: props.courseId,
        });

        if (data) {
          toast.success(data.message);
          if (data.course.lessons) {
            router.push(
              `/courses/${data.course.id}/lessons/${data.course.lessons[0].id}`
            );
          }
          router.refresh();
          return;
        }

        toast.error("Some error occurred", {
          description: serverError,
        });
        return;
      }}
    >
      Join
    </Button>
  );
};

export default JoinCourseButton;
