"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@ikigai/ui/button";
import {
  ArrowRight,
  Bot,
  Building2,
  ChevronRight,
  Globe,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.refresh() },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Link href="/" className="mr-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">IKIGAI</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link href="/properties/search" className="rounded-md px-3 py-2 text-foreground/60 hover:text-foreground transition-colors">
              物件検索
            </Link>
            <Link href="/chat" className="rounded-md px-3 py-2 text-foreground/60 hover:text-foreground transition-colors">
              AIチャット
            </Link>
            <Link href="/journey" className="rounded-md px-3 py-2 text-foreground/60 hover:text-foreground transition-colors">
              進捗管理
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{session.user.name}</span>
                <Button variant="ghost" size="sm" onClick={signOut}>ログアウト</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild><Link href="/sign-in">ログイン</Link></Button>
                <Button size="sm" asChild><Link href="/sign-up">無料で始める</Link></Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-accent/5 blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>AI-Powered Real Estate Platform</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              不動産取引を、
              <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                もっとスマート
              </span>
              に
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              AIがあなたの不動産取引をサポート。物件検索から契約まで、
              <br className="hidden sm:inline" />
              すべてのプロセスをインテリジェントにガイドします。
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2 px-8" asChild>
                <Link href="/properties/search">
                  <Search className="h-5 w-5" />
                  物件を探す
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
                <Link href="/chat">
                  <MessageCircle className="h-5 w-5" />
                  AIに相談する
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">AIが新しい不動産体験を</h2>
            <p className="text-muted-foreground">IKIGAIの先進的な機能で、不動産取引の全行程をカバーします</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Bot,
                title: "AIアシスタント",
                description: "自然言語で物件を検索。「渋谷区で3LDK、駅徒歩5分以内」と話すだけ。",
                color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
              },
              {
                icon: TrendingUp,
                title: "価格分析",
                description: "AIが市場データを分析し、価格の妥当性と将来の資産価値を予測。",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
              },
              {
                icon: Shield,
                title: "リスク評価",
                description: "耐震基準、ハザードゾーン、事故物件を自動チェック。安全な取引を。",
                color: "text-green-500 bg-green-50 dark:bg-green-950/30",
              },
              {
                icon: MapPin,
                title: "スマート検索",
                description: "15区 × 価格帯 × 間取り × 駅徒歩。あなたの条件にぴったりの物件を。",
                color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
              },
              {
                icon: Globe,
                title: "日本語特化",
                description: "万円表記、坪換算、旧暦対応。日本の不動産慣行に完全対応。",
                color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
              },
              {
                icon: Zap,
                title: "進捗管理",
                description: "物件探しから引き渡しまで。購入プロセスの全ステップを可視化。",
                color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex rounded-lg p-2.5 ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">技術スタック</h2>
            <p className="text-muted-foreground">モダンなテクノロジーで構築された堅牢なプラットフォーム</p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { name: "Next.js 16", detail: "App Router" },
              { name: "Gemini 2.0", detail: "AI Engine" },
              { name: "PostgreSQL", detail: "Database" },
              { name: "Drizzle ORM", detail: "Type-safe" },
              { name: "TypeScript", detail: "Full Stack" },
              { name: "Tailwind CSS", detail: "Styling" },
              { name: "Vercel AI", detail: "Streaming" },
              { name: "Turborepo", detail: "Monorepo" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="rounded-lg border bg-card p-4 text-center transition-colors hover:bg-secondary/50"
              >
                <p className="font-semibold">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-b from-accent/5 to-transparent py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold">今すぐ始めましょう</h2>
          <p className="mb-8 text-muted-foreground">
            AIの力で、理想の物件との出会いを。
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/properties/search">
                物件を探す
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-accent">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold">IKIGAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 IKIGAI. AI-Powered Real Estate Platform for Japan.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/properties/search" className="hover:text-foreground transition-colors">物件検索</Link>
              <Link href="/chat" className="hover:text-foreground transition-colors">AIチャット</Link>
              <Link href="/journey" className="hover:text-foreground transition-colors">進捗管理</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
