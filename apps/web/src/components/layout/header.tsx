"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@ikigai/ui/button";
import { Building2, MessageCircle, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl">IKIGAI</span>
        </Link>
        <nav className="flex items-center space-x-1 text-sm font-medium">
          <Link
            href="/properties/search"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors hover:bg-secondary text-foreground/60 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            物件検索
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors hover:bg-secondary text-foreground/60 hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            AIチャット
          </Link>
          <Link
            href="/journey"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors hover:bg-secondary text-foreground/60 hover:text-foreground"
          >
            <Building2 className="h-4 w-4" />
            進捗管理
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-3 pr-1">
          {session ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm text-foreground/60 hidden sm:inline">{session.user.name}</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">ログイン</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">新規登録</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
