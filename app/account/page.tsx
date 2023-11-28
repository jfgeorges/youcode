import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await getAuthSession();

  if (!session) {
    throw new Error("No session found");
  }
  const user = session?.user;

  if (!user) {
    return redirect("/");
  }
  return (
    <Card className="m-auto mt-4 max-w-lg">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          {user.image && (
            <AvatarImage src={user.image} alt={user.name ?? "User Picture"} />
          )}
        </Avatar>
        <div className="flex flex-col gap-1">
          <CardTitle>{user.email}</CardTitle>
          <CardDescription>{user.name}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Link
          className={buttonVariants({ variant: "outline", size: "lg" })}
          href="/account/settings"
        >
          Settings
        </Link>
        <Link
          className={buttonVariants({ variant: "outline", size: "lg" })}
          href="/admin"
        >
          Admin
        </Link>
      </CardContent>
      <CardFooter className="flex, flex-row-reverse">
        <LogoutButton />
      </CardFooter>
    </Card>
  );
}
