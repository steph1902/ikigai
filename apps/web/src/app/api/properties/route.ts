import { db } from "@ikigai/db";
import { properties } from "@ikigai/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;

        const ward = searchParams.get("ward");
        const priceMin = searchParams.get("priceMin");
        const priceMax = searchParams.get("priceMax");
        const layout = searchParams.get("layout");
        const walkMinutes = searchParams.get("walkMinutes");
        const earthquakeStandard = searchParams.get("earthquakeStandard");
        const buildingType = searchParams.get("buildingType");
        const sort = searchParams.get("sort") ?? "newest";
        const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
        const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "20", 10), 50);
        const offset = (page - 1) * limit;

        const conditions = [eq(properties.isActive, true)];

        if (ward) {
            conditions.push(ilike(properties.municipality, `%${ward}%`));
        }
        if (priceMin) {
            conditions.push(gte(properties.listingPrice, Number.parseInt(priceMin, 10)));
        }
        if (priceMax) {
            conditions.push(lte(properties.listingPrice, Number.parseInt(priceMax, 10)));
        }
        if (layout) {
            conditions.push(ilike(properties.floorPlan, `%${layout}%`));
        }
        if (walkMinutes) {
            conditions.push(
                lte(properties.nearestStationWalkMinutes, Number.parseInt(walkMinutes, 10)),
            );
        }
        if (earthquakeStandard) {
            conditions.push(
                eq(
                    properties.earthquakeStandard,
                    earthquakeStandard as "old" | "new" | "grade1" | "grade2" | "grade3" | "unknown",
                ),
            );
        }
        if (buildingType) {
            conditions.push(
                eq(
                    properties.buildingType,
                    buildingType as "mansion" | "apartment" | "kodate" | "land",
                ),
            );
        }

        const orderByClause = (() => {
            switch (sort) {
                case "priceAsc":
                    return asc(properties.listingPrice);
                case "priceDesc":
                    return desc(properties.listingPrice);
                case "areaDesc":
                    return desc(properties.totalAreaSqm);
                case "walkMinutes":
                    return asc(properties.nearestStationWalkMinutes);
                case "newest":
                default:
                    return desc(properties.createdAt);
            }
        })();

        const [results, countResult] = await Promise.all([
            db
                .select()
                .from(properties)
                .where(and(...conditions))
                .orderBy(orderByClause)
                .limit(limit)
                .offset(offset),
            db
                .select({ count: sql<number>`count(*)::int` })
                .from(properties)
                .where(and(...conditions)),
        ]);

        const totalCount = countResult[0]?.count ?? 0;

        return NextResponse.json({
            properties: results,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: offset + limit < totalCount,
            },
        });
    } catch (error) {
        console.error("Property search error:", error);
        return NextResponse.json(
            { error: "Failed to search properties" },
            { status: 500 },
        );
    }
}
