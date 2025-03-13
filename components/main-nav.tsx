"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { BookOpen, FileText, Home, MessageSquare, Settings } from "lucide-react"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/essays",
      label: "My Essays",
      icon: FileText,
      active: pathname === "/essays" || pathname.startsWith("/essays/"),
    },
    {
      href: "/examples",
      label: "Example Essays",
      icon: BookOpen,
      active: pathname === "/examples",
    },
    // {
    //   href: "/chat",
    //   label: "AI Chat",
    //   icon: MessageSquare,
    //   active: pathname === "/chat",
    // },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="h-4 w-4" />
          <span className="hidden md:inline">{route.label}</span>
        </Link>
      ))}
    </nav>
  )
}

