"use client";

import {
  formatPrice,
  formatArea,
  formatStationAccess,
  formatBuildingAge,
  formatMonthlyCosts,
  formatEarthquakeStandard,
  formatFloorInfo,
  formatStructure,
} from "@ikigai/i18n/formatters";
import { calculatePurchaseCosts } from "@ikigai/domain/rules/fees";
import { assessPropertyRisk } from "@ikigai/domain/rules/risk";
import { Button } from "@ikigai/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Heart,
  Info,
  Layers,
  MapPin,
  MessageCircle,
  Ruler,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Train,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Property {
  id: string;
  address: string;
  prefecture: string;
  municipality: string;
  district: string;
  buildingType: string;
  structure: string;
  totalAreaSqm: string;
  landAreaSqm: string | null;
  floorPlan: string;
  numRooms: number;
  floorLevel: number;
  totalFloors: number;
  totalUnits: number;
  yearBuilt: number;
  earthquakeStandard: string;
  listingPrice: number;
  managementFee: number;
  repairReserveFee: number;
  nearestStationName: string;
  nearestStationLine: string;
  nearestStationWalkMinutes: number;
  features: string;
  images: string;
  description: string;
  psychologicalDefect: string | null;
  designatedZone: boolean;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        const data = await res.json();
        setProperty(data.property);
      } catch {
        console.error("Failed to fetch property");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="aspect-[16/9] rounded-xl bg-muted" />
            <div className="space-y-3">
              <div className="h-8 w-64 rounded bg-muted" />
              <div className="h-4 w-48 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Building2 className="mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="mb-2 text-xl font-medium">物件が見つかりませんでした</h2>
        <Button asChild variant="outline">
          <Link href="/properties/search">物件検索に戻る</Link>
        </Button>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const buildingAge = currentYear - property.yearBuilt;
  const images = (() => {
    try { return JSON.parse(property.images || "[]") as string[]; } catch { return []; }
  })();
  const features = (() => {
    try { return JSON.parse(property.features || "[]") as string[]; } catch { return []; }
  })();
  const monthlyCosts = formatMonthlyCosts({
    managementFee: property.managementFee,
    repairReserveFund: property.repairReserveFee,
  });
  const eqStandard = formatEarthquakeStandard(
    property.earthquakeStandard as Parameters<typeof formatEarthquakeStandard>[0],
  );
  const purchaseCosts = calculatePurchaseCosts(property.listingPrice);
  const risk = assessPropertyRisk({
    earthquakeStandard: property.earthquakeStandard as Parameters<typeof assessPropertyRisk>[0]["earthquakeStandard"],
    yearBuilt: property.yearBuilt,
    structure: property.structure as Parameters<typeof assessPropertyRisk>[0]["structure"],
    psychologicalDefect: property.psychologicalDefect,
    designatedZone: property.designatedZone,
  });

  const RiskIcon = risk.overallLevel === "low" ? ShieldCheck :
    risk.overallLevel === "medium" ? Shield :
      risk.overallLevel === "high" ? ShieldAlert : AlertTriangle;

  const riskColor = risk.overallLevel === "low" ? "text-green-600" :
    risk.overallLevel === "medium" ? "text-yellow-600" :
      risk.overallLevel === "high" ? "text-orange-600" : "text-red-600";

  const riskBg = risk.overallLevel === "low" ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900" :
    risk.overallLevel === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900" :
      risk.overallLevel === "high" ? "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900" :
        "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Back nav */}
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <Link
          href="/properties/search"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          物件検索に戻る
        </Link>
      </div>

      {/* Hero image */}
      <div className="container mx-auto max-w-4xl px-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          {images[0] ? (
            <img
              src={images[0]}
              alt={property.address}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-20 w-20 text-muted-foreground/20" />
            </div>
          )}
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-3 backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Price & Address */}
            <div>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(property.listingPrice)}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.address}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Train className="h-4 w-4" />
                <span>
                  {formatStationAccess(
                    property.nearestStationName,
                    property.nearestStationLine,
                    property.nearestStationWalkMinutes,
                  )}
                </span>
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Layers, value: property.floorPlan, label: "間取り" },
                { icon: Ruler, value: formatArea(Number(property.totalAreaSqm), false), label: "専有面積" },
                { icon: Calendar, value: formatBuildingAge(buildingAge), label: "築年数" },
                { icon: Building2, value: formatFloorInfo(property.floorLevel, property.totalFloors), label: "階数" },
              ].map((spec) => (
                <div key={spec.label} className="rounded-lg border bg-card p-3 text-center">
                  <spec.icon className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
                  <p className="text-lg font-semibold">{spec.value}</p>
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Property details table */}
            <div className="rounded-xl border bg-card">
              <h3 className="border-b px-5 py-3 font-semibold">物件概要</h3>
              <div className="divide-y">
                {[
                  ["所在地", property.address],
                  ["最寄り駅", formatStationAccess(property.nearestStationName, property.nearestStationLine, property.nearestStationWalkMinutes)],
                  ["間取り", property.floorPlan],
                  ["専有面積", formatArea(Number(property.totalAreaSqm))],
                  ["構造", formatStructure(property.structure as Parameters<typeof formatStructure>[0])],
                  ["階数", formatFloorInfo(property.floorLevel, property.totalFloors)],
                  ["総戸数", `${property.totalUnits}戸`],
                  ["築年", `${property.yearBuilt}年（${formatBuildingAge(buildingAge)}）`],
                  ["耐震基準", eqStandard.label],
                ].map(([label, value]) => (
                  <div key={label} className="flex px-5 py-3">
                    <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="rounded-xl border bg-card">
                <h3 className="border-b px-5 py-3 font-semibold">設備・特徴</h3>
                <div className="flex flex-wrap gap-2 p-5">
                  {features.map((feature: string) => (
                    <span key={feature} className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Assessment */}
            <div className={`rounded-xl border ${riskBg}`}>
              <div className="flex items-center gap-3 border-b px-5 py-3">
                <RiskIcon className={`h-5 w-5 ${riskColor}`} />
                <h3 className="font-semibold">リスク評価</h3>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${riskColor}`}>
                  スコア: {risk.score}/100
                </span>
              </div>
              <div className="p-5">
                <p className="mb-4 text-sm">{risk.summaryJa}</p>
                {risk.factors.map((factor) => (
                  <div key={factor.id} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${factor.level === "low" ? "bg-green-500" :
                          factor.level === "medium" ? "bg-yellow-500" :
                            factor.level === "high" ? "bg-orange-500" : "bg-red-500"
                        }`} />
                      <span className="text-sm font-medium">{factor.labelJa}</span>
                    </div>
                    <p className="ml-4 text-xs text-muted-foreground">{factor.descriptionJa}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="rounded-xl border bg-card">
                <h3 className="border-b px-5 py-3 font-semibold">物件説明</h3>
                <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Price card */}
            <div className="rounded-xl border bg-card p-5">
              <p className="text-2xl font-bold">{formatPrice(property.listingPrice)}</p>
              <div className="mt-4 space-y-2">
                {monthlyCosts.map((cost) => (
                  <div key={cost.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{cost.label}</span>
                    <span className={cost.label === "月額合計" ? "font-semibold" : ""}>{cost.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase costs */}
            <div className="rounded-xl border bg-card p-5">
              <h4 className="mb-3 text-sm font-semibold">購入時の諸費用（概算）</h4>
              <div className="space-y-2 text-sm">
                {[
                  ["仲介手数料", formatPrice(purchaseCosts.brokerageFee)],
                  ["登録免許税", formatPrice(purchaseCosts.registrationTax)],
                  ["印紙税", `${purchaseCosts.stampDuty.toLocaleString("ja-JP")}円`],
                  ["不動産取得税", formatPrice(purchaseCosts.acquisitionTax)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>総額（目安）</span>
                    <span>{formatPrice(purchaseCosts.totalWithProperty)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 flex items-start gap-1 text-[10px] text-muted-foreground">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                概算値です。詳細は宅地建物取引士にご確認ください。
              </p>
            </div>

            {/* AI Estimation */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-semibold">AI価格分析</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                AIによる価格妥当性分析は、チャットでお尋ねください。
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5" asChild>
                <Link href="/chat">
                  <MessageCircle className="h-4 w-4" />
                  AIに相談する
                </Link>
              </Button>
            </div>

            {/* CTA buttons */}
            <div className="space-y-2">
              <Button className="w-full gap-1.5">
                <MessageCircle className="h-4 w-4" />
                お問い合わせ
              </Button>
              <Button variant="outline" className="w-full gap-1.5" onClick={() => setSaved(!saved)}>
                <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                {saved ? "保存済み" : "お気に入りに追加"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
