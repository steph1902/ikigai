import { db } from "@ikigai/db";
import { properties } from "@ikigai/db/schema";
import { NextResponse } from "next/server";

/**
 * Seed the database with realistic synthetic property data for demo purposes.
 * POST /api/properties/seed
 */
export async function POST() {
    try {
        const seedProperties = generateSeedProperties();

        await db.insert(properties).values(seedProperties).onConflictDoNothing();

        return NextResponse.json({
            message: `Seeded ${seedProperties.length} properties`,
            count: seedProperties.length,
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Failed to seed properties" },
            { status: 500 },
        );
    }
}

function generateSeedProperties() {
    const tokyoWards = [
        { name: "渋谷区", station: "渋谷", line: "JR山手線" },
        { name: "新宿区", station: "新宿", line: "JR中央線" },
        { name: "港区", station: "六本木", line: "東京メトロ日比谷線" },
        { name: "目黒区", station: "中目黒", line: "東急東横線" },
        { name: "世田谷区", station: "三軒茶屋", line: "東急田園都市線" },
        { name: "中央区", station: "銀座", line: "東京メトロ銀座線" },
        { name: "千代田区", station: "秋葉原", line: "JR総武線" },
        { name: "文京区", station: "本郷三丁目", line: "東京メトロ丸ノ内線" },
        { name: "台東区", station: "上野", line: "JR京浜東北線" },
        { name: "品川区", station: "大崎", line: "JR山手線" },
        { name: "豊島区", station: "池袋", line: "JR山手線" },
        { name: "杉並区", station: "荻窪", line: "JR中央線" },
        { name: "中野区", station: "中野", line: "JR中央線" },
        { name: "板橋区", station: "板橋", line: "JR埼京線" },
        { name: "練馬区", station: "練馬", line: "西武池袋線" },
    ];

    const layouts = ["1R", "1K", "1LDK", "2LDK", "3LDK", "4LDK", "2DK", "3DK"];
    const structures: Array<"rc" | "src" | "steel" | "wood"> = ["rc", "src", "steel", "wood"];
    const earthquakeStandards: Array<"old" | "new" | "grade1" | "grade2" | "grade3"> = [
        "new", "new", "new", "grade1", "grade2", "grade3", "old",
    ];

    const buildingNames = [
        "パークハウス", "ブリリア", "プラウド", "グランドメゾン", "シティハウス",
        "レジデンシア", "ザ・パークハウス", "ディアナコート", "パークコート", "ピアース",
        "クレヴィア", "リビオ", "シエリア", "ドレッセ", "ソルフィエスタ",
    ];

    const imageUrls = [
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    ];

    return Array.from({ length: 40 }, (_, i) => {
        const ward = tokyoWards[i % tokyoWards.length]!;
        const layout = layouts[i % layouts.length]!;
        const structure = structures[i % structures.length]!;
        const eqStd = earthquakeStandards[i % earthquakeStandards.length]!;
        const name = buildingNames[i % buildingNames.length]!;

        const yearBuilt = 1985 + Math.floor(Math.random() * 40);
        const totalArea = 25 + Math.floor(Math.random() * 100);
        const numRooms = Math.max(1, Number.parseInt(layout[0]!, 10) || 1);
        const walkMinutes = 1 + Math.floor(Math.random() * 18);
        const totalFloors = 3 + Math.floor(Math.random() * 30);
        const floorLevel = 1 + Math.floor(Math.random() * totalFloors);

        // Price correlates with area, ward prestige, and station proximity
        const wardMultiplier = i < 6 ? 1.5 : i < 10 ? 1.2 : 1.0;
        const basePrice = totalArea * 800_000 * wardMultiplier;
        const walkDiscount = walkMinutes > 10 ? 0.85 : 1.0;
        const price = Math.round((basePrice * walkDiscount) / 10_000) * 10_000;

        return {
            source: "suumo" as const,
            sourceListingId: `SEED-${String(i + 1).padStart(4, "0")}`,
            address: `東京都${ward.name}${Math.floor(Math.random() * 5 + 1)}-${Math.floor(Math.random() * 20 + 1)}-${Math.floor(Math.random() * 10 + 1)}`,
            prefecture: "東京都",
            municipality: ward.name,
            district: ward.name.replace("区", ""),
            buildingType: "mansion" as const,
            structure,
            totalAreaSqm: String(totalArea),
            floorPlan: layout,
            numRooms,
            floorLevel,
            totalFloors,
            totalUnits: totalFloors * 4,
            yearBuilt,
            earthquakeStandard: eqStd,
            listingPrice: price,
            managementFee: 8000 + Math.floor(Math.random() * 25000),
            repairReserveFee: 5000 + Math.floor(Math.random() * 20000),
            nearestStationName: ward.station,
            nearestStationLine: ward.line,
            nearestStationWalkMinutes: walkMinutes,
            features: JSON.stringify(
                ["オートロック", "宅配ボックス", "ペット可", "南向き", "角部屋", "二重サッシ"]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 2 + Math.floor(Math.random() * 3)),
            ),
            images: JSON.stringify([imageUrls[i % imageUrls.length]]),
            description: `${name} ${ward.name}。${ward.line}「${ward.station}」駅より徒歩${walkMinutes}分。${layout}、${totalArea}㎡。築${new Date().getFullYear() - yearBuilt}年のマンションです。`,
            isActive: true,
        };
    });
}
