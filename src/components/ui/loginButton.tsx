"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Github, Mail, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const LoginButton = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignIn = async () => {
    console.log("---- Github sign in result ----");
    const result = await signIn("github");

    console.log(result);
    setIsLogged(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isLogged ? (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="outline">Connexion</Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {isLogged ? (
            <DropdownMenuItem>
              <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
                <Unplug className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem>
                <Button variant="ghost" onClick={handleSignIn}>
                  <Github className="mr-2 h-4 w-4" />
                  Login with Github
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="ghost" onClick={() => setIsLogged(true)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Login with Gmail
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sur you want to disconnect from YouCode ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                signOut();
                setIsLogged(false);
                setIsDialogOpen(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
