"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { AdminLessonItem } from "./AdminLessonItem";
import { AdminLessonItemType } from "./adminLessons.query";
import { toast } from "sonner";
import { saveLessonOrder } from "./lessons.action";
import { cn } from "@/lib/utils";

type AdminLessonSortableProps = {
  lessons: AdminLessonItemType[];
};

export const AdminLessonSortable = ({
  lessons: defaultLessons,
}: AdminLessonSortableProps) => {
  const [items, setItems] = useState(defaultLessons);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({
      activeId,
      newUpItemRank,
      newDownItemRank,
    }: {
      activeId: string;
      newUpItemRank: string | undefined;
      newDownItemRank: string | undefined;
    }) => {
      const { serverError, data } = await saveLessonOrder({
        upItemRank: newUpItemRank,
        downItemRank: newDownItemRank,
        lessonId: activeId,
      });

      if (serverError) {
        toast.error(serverError);
        return;
      }

      if (!data) return;

      router.refresh();

      setItems((prevItems) => {
        const activeItem = prevItems.find((item) => item.id === activeId);
        if (!activeItem) return prevItems;

        activeItem.rank = data;

        return [...prevItems];
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      toast.error("Drag'n drop error");
      return;
    }
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        const newUpItemRank = newItems[newIndex - 1]?.rank;
        const newDownItemRank = newItems[newIndex + 1]?.rank;

        mutation.mutate({
          activeId: String(active.id),
          newUpItemRank,
          newDownItemRank,
        });

        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
        disabled={mutation.isPending}
      >
        <div
          className={cn("flex flex-col gap-2", {
            "opacity-50": mutation.isPending,
          })}
        >
          {items.map((lesson) => (
            <AdminLessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
