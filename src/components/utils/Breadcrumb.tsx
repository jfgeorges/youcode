"use client";

import { useIsClient } from "@/hooks/useIsClient";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export const Breadcrumb = () => {
  const _pathname = usePathname();
  const pathname = _pathname?.split("/").filter(Boolean) ?? [];

  const isClient = useIsClient();

  if (!isClient) return;

  return (
    <nav aria-label="Breadcrumb" className="mx-4">
      <ol
        role="list"
        className="text-skin-secondary flex items-center gap-1 text-sm"
      >
        {pathname.map((item, index) => (
          <Fragment key={item}>
            {index === 0 ? (
              <Home className="text-muted-foreground" size={16} />
            ) : (
              <ChevronRight className="text-muted-foreground" size={16} />
            )}
            <li>
              <Link
                href={`/${pathname.slice(0, index + 1).join("/")}`}
                className="block text-xs text-muted-foreground transition hover:text-foreground"
              >
                {isPrismaId(item) ? formatId(item) : item}
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

const isPrismaId = (id: string): boolean => {
  // Regular expression to match URL-friendly strings of exactly 25 characters.
  const regex = /^[\w-]{25}$/;
  return regex.test(id);
};

export const formatId = (id: string) => {
  return `${id.slice(0, 2)}...${id.slice(-2)}`;
};
