"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@ikigai/ui/button";
import Link from "next/link";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center pl-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">IKIGAI</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/search"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Search
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4 pr-4">
          {session ? (
            <span className="text-sm text-foreground/60">{session.user.name}</span>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
