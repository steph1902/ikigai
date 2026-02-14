import { db } from '@ikigai/db';
import { properties } from '@ikigai/db/schema';
import { generateDataset, generatePriceHistory } from './generators/property';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from correct path
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const SEED_COUNT = 500;

async function main() {
    console.log('🌱 Starting seed process...');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is not set.');
        process.exit(1);
    }

    try {
        console.log('🧹 Cleaning existing property data...');
        // Simple table wipe — in prod be careful!
        await db.delete(properties);
        console.log('✅ Data cleaned.');

        console.log(`🏭 Generating ${SEED_COUNT} synthetic properties...`);
        const dataset = generateDataset(SEED_COUNT);

        console.log('💾 Inserting into database...');

        // Batch insert mechanism
        const BATCH_SIZE = 50;
        for (let i = 0; i < dataset.length; i += BATCH_SIZE) {
            const batch = dataset.slice(i, i + BATCH_SIZE).map(prop => {
                // Prepare data for Drizzle insert
                // PostGIS point: ST_SetSRID(ST_MakePoint(lng, lat), 4326)
                // We use sql helper to inject raw SQL for the geometry column
                const { lat, lng, listingDate, ...rest } = prop;

                return {
                    ...rest,
                    listingDate: listingDate.toISOString(),
                    // Use raw SQL for geometry point insertion
                    location: sql`st_setsrid(st_makepoint(${lng}, ${lat}), 4326)`
                };
            });

            await db.insert(properties).values(batch);
            console.log(`   Points ${i + 1} to ${Math.min(i + BATCH_SIZE, dataset.length)} inserted.`);
        }

        console.log('✅ Properties seeded successfully.');

        // Optional: Generate price history (if we had a table for it)
        // For now, we just log it as a capability
        console.log('📊 Simulated price history available for market analysis.');

        console.log('🎉 Seed complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

main();
