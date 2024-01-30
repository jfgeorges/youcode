/* eslint-disable @next/next/no-img-element */
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { getRequiredAuthSession } from "@/lib/auth";
import Link from "next/link";
import { PaginationButton } from "../../../../src/features/pagination/PaginationButton";
import { getAdminCourse } from "./admin-course.query";
import { MoreHorizontal } from "lucide-react";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: {
    courseId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page ?? 0);

  const session = await getRequiredAuthSession();

  const course = await getAdminCourse({
    courseId: params.courseId,
    userId: session.user.id,
    userPage: page,
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Courses</LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-4 lg:flex-row">
        <Card className="flex-[2]">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Action</TableHead>
              </TableHeader>
              <TableBody>
                {course.users?.map((user) => (
                  <TableRow
                    key={user.id}
                    className="transition-colors hover:bg-accent"
                  >
                    <TableCell>
                      <UserAvatar email={user.email} image={user.image} />
                    </TableCell>
                    <TableCell>
                      <Typography
                        as={Link}
                        variant="large"
                        href={`/admin/users/${user.id}`}
                      >
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.canceled ? "Canceled" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex flex-row-reverse">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button size="sm" variant="secondary">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <form>
                              <button
                                formAction={async () => {
                                  "use server";

                                  const session =
                                    await getRequiredAuthSession();

                                  const courseId = params.courseId;
                                  const userId = user.id;

                                  const courseOnUser =
                                    await prisma.courseOnUser.findFirst({
                                      where: {
                                        userId,
                                        course: {
                                          id: courseId,
                                          creatorId: session?.user.id,
                                        },
                                      },
                                    });

                                  if (!courseOnUser) return;

                                  await prisma.courseOnUser.update({
                                    where: {
                                      id: courseOnUser.id,
                                    },
                                    data: {
                                      canceledAt: courseOnUser.canceledAt
                                        ? null
                                        : new Date(),
                                    },
                                  });

                                  revalidatePath(`/admin/courses/${courseId}`);
                                }}
                              >
                                {user.canceled ? "Activate" : "Cancel"}
                              </button>
                            </form>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationButton
              baseUrl={`/admin/courses/${course.id}`}
              page={page}
              totalPage={Math.floor((course._count?.users ?? 0) / 5)}
            />
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Avatar className="rounded">
              <AvatarFallback>{course.name?.[0]}</AvatarFallback>
              {course.image && (
                <AvatarImage src={course.image} alt={course.name ?? ""} />
              )}
            </Avatar>
            <CardTitle>{course.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <Typography>{course._count?.users} users</Typography>
            <Typography>{course._count?.lessons} lessons</Typography>
            <Link
              href={`/admin/courses/${course.id}/edit`}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Edit
            </Link>
            <Link
              href={`/admin/courses/${course.id}/lessons`}
              className={buttonVariants({
                variant: "outline",
              })}
            >
              Edit lessons
            </Link>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}

export type userAvatarProps = {
  email: string;
  image?: string;
};
const UserAvatar = ({ email, image }: userAvatarProps) => {
  const avatarImage =
    image ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`;
  return (
    <Avatar className="rounded">
      <AvatarFallback>{email?.[0]}</AvatarFallback>
      <AvatarImage src={avatarImage} alt={email ?? ""} />
    </Avatar>
  );
};
