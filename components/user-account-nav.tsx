"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import { signOut as signOut2} from "next-auth/react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";  // Importing useRouter from Next.js
import {useEffect, useState} from 'react'
import { useAuth } from "@/components/auth-provider";
import Link from "next/link"

export function UserAccountNav() {
  const auth = getAuth();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const handleSignOut = async () => {
    console.log("logging out")
    try {
      // Sign out the user
      await signOut2({callbackUrl: '/'});
      await signOut(auth);
      console.log("User signed out!");

      // Redirect to the homepage or another page after sign-out
      router.push("/");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.firstName } {user?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick = {() => {router.push("/settings")}} >
          <div className = "flex flex-row">
              <Settings className="mr-2 h-4 w-4" />
              Settings
          </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span onClick = {handleSignOut}>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

