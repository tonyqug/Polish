import Link from "next/link"

import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserAccountNav } from "@/components/user-account-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">EssayPolish</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <MainNav className="mx-6" />
          <div className="flex items-center space-x-1">
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  )
}

