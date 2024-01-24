import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { AdminLessonItemType } from "./adminLessons.query";
import { AlignJustify } from "lucide-react";

export type LessonItemProps = {
  lesson: AdminLessonItemType;
};

export const AdminLessonItem = ({ lesson }: LessonItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2"
      {...attributes}
      {...listeners}
    >
      <Link
        href={`/admin/courses/${lesson.courseId}/lessons/${lesson.id}`}
        className="flex-1"
      >
        <div className="flex items-center rounded border border-border bg-card px-4 py-2 transition-colors hover:bg-accent">
          <Typography variant="large">{lesson.name}</Typography>
          <Badge className="ml-auto">{lesson.state}</Badge>
        </div>
      </Link>
      <AlignJustify size={16} className="cursor-move" />
    </div>
  );
};
