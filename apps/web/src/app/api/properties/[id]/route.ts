import { db } from "@ikigai/db";
import { properties } from "@ikigai/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const result = await db
            .select()
            .from(properties)
            .where(eq(properties.id, id))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ property: result[0] });
    } catch (error) {
        console.error("Property detail error:", error);
        return NextResponse.json(
            { error: "Failed to fetch property" },
            { status: 500 },
        );
    }
}
