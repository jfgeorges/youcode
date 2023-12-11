"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useRouter } from "next/navigation";

export type PaginationButtonProps = {
  baseUrl: string;
  page: number;
  totalPage: number;
};

export const PaginationButton = (props: PaginationButtonProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={props.page <= 0}
        onClick={() => {
          const searchParams = new URLSearchParams({
            page: String(props.page - 1),
          });
          const url = `${props.baseUrl}?${searchParams.toString()}`;
          router.push(url);
        }}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={props.page >= props.totalPage}
        onClick={() => {
          const searchParams = new URLSearchParams({
            page: String(props.page + 1),
          });
          const url = `${props.baseUrl}?${searchParams.toString()}`;
          router.push(url);
        }}
      >
        Next
      </Button>
      <Typography variant={"small"}>{`Page ${props.page + 1} / ${
        props.totalPage + 1
      }`}</Typography>
    </div>
  );
};
