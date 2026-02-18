import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY ?? "",
});

const SYSTEM_PROMPT = `あなたは「IKIGAI」、日本の不動産に特化したAIアシスタントです。

## あなたの役割
- 日本の不動産取引に関する質問に丁寧に回答する
- 物件の検索条件を理解し、適切な物件を提案する
- 価格の妥当性や市場動向について分析する
- 購入プロセス（重要事項説明、契約、ローン）をガイドする
- リスク要因（旧耐震、事故物件、ハザードゾーン）を説明する

## 重要なルール
- 必ず日本語で回答してください
- 法的アドバイスではなく、あくまで参考情報であることを明示してください
- 不確かな情報は「確認が必要です」と正直に伝えてください
- 宅地建物取引士への相談を適宜推奨してください
- 金額は万円・億円で表示してください

## トーン
- 丁寧で親しみやすい（です・ます調）
- 専門用語を使う場合は簡単な説明を添える
- ユーザーの不安を軽減するような温かい対応`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        searchProperties: tool({
          description:
            "物件を検索します。ユーザーの条件（エリア、価格帯、間取り等）に基づいて物件を探します。",
          parameters: z.object({
            ward: z.string().optional().describe("東京の区名（例: 渋谷区）"),
            priceMin: z.number().optional().describe("最低価格（円）"),
            priceMax: z.number().optional().describe("最高価格（円）"),
            layout: z.string().optional().describe("間取り（例: 2LDK）"),
            walkMinutes: z.number().optional().describe("駅徒歩分数上限"),
          }),
          execute: async ({ ward, priceMin, priceMax, layout, walkMinutes }) => {
            const params = new URLSearchParams();
            if (ward) params.set("ward", ward);
            if (priceMin) params.set("priceMin", String(priceMin));
            if (priceMax) params.set("priceMax", String(priceMax));
            if (layout) params.set("layout", layout);
            if (walkMinutes) params.set("walkMinutes", String(walkMinutes));
            params.set("limit", "5");

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
            const res = await fetch(
              `${baseUrl}/api/properties?${params.toString()}`,
            );
            const data = await res.json();

            return {
              count: data.pagination?.totalCount ?? 0,
              properties: (data.properties ?? []).slice(0, 5).map((p: Record<string, unknown>) => ({
                id: p.id,
                address: p.address,
                price: p.listingPrice,
                layout: p.floorPlan,
                area: p.totalAreaSqm,
                station: p.nearestStationName,
                walkMinutes: p.nearestStationWalkMinutes,
                yearBuilt: p.yearBuilt,
              })),
            };
          },
        }),
        calculateFees: tool({
          description: "物件購入時の諸費用（仲介手数料、登録免許税等）を計算します。",
          parameters: z.object({
            price: z.number().describe("物件価格（円）"),
          }),
          execute: async ({ price }) => {
            const feeBeforeTax = price > 4_000_000
              ? price * 0.03 + 60_000
              : price > 2_000_000
                ? 2_000_000 * 0.05 + (price - 2_000_000) * 0.04
                : price * 0.05;
            const tax = Math.floor(feeBeforeTax * 0.1);
            const brokerageFee = Math.floor(feeBeforeTax) + tax;
            const registrationTax = Math.floor(price * 0.7 * 0.02);
            const acquisitionTax = Math.floor(price * 0.7 * 0.03);

            return {
              brokerageFee,
              registrationTax,
              acquisitionTax,
              total: brokerageFee + registrationTax + acquisitionTax,
              totalWithProperty: price + brokerageFee + registrationTax + acquisitionTax,
            };
          },
        }),
      },
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "チャットの処理中にエラーが発生しました" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
