

Great clarification — that changes things significantly. Since this is a portfolio project, we need to be strategic about where we invest effort for maximum impressiveness versus where we fake it intelligently.

Let me address the data question first, then write out all the missing sections.

---

# Data Strategy for a Portfolio Project

## Don't Scrape. Here's Why.

Scraping Japanese real estate portals like Suumo, LIFULL HOME'S, or at HOME for a portfolio project is a bad idea for several reasons. Their terms of service explicitly prohibit it. Getting caught and having your project associated with ToS violations is the opposite of what you want in a portfolio. The scraping infrastructure is complex and fragile — you'd spend weeks maintaining scrapers instead of building impressive features. And you don't need real data to demonstrate architectural competence.

## The Right Approach: Realistic Synthetic Data

What actually impresses reviewers and hiring managers is a system that **looks and behaves** like it's working with real data, with an architecture that **could** plug into real sources. Here's the strategy:

### Tier 1: Seed Data Generator

Build a `packages/seed` package that generates realistic Japanese property data. This is itself a portfolio-worthy piece of engineering.

```typescript
// packages/seed/src/generators/property.ts

import { faker } from '@faker-js/faker/locale/ja';

// Real Tokyo ward/station data for geographic accuracy
const TOKYO_AREAS = [
  {
    ward: '渋谷区',
    stations: [
      { name: '渋谷', lines: ['JR山手線', '東急東横線', '銀座線', '半蔵門線', '副都心線'], lat: 35.6580, lng: 139.7016 },
      { name: '恵比寿', lines: ['JR山手線', '日比谷線'], lat: 35.6467, lng: 139.7100 },
      { name: '代官山', lines: ['東急東横線'], lat: 35.6488, lng: 139.7033 },
      { name: '表参道', lines: ['銀座線', '千代田線', '半蔵門線'], lat: 35.6653, lng: 139.7121 },
    ],
    pricePerSqm: { min: 800000, max: 2500000 }, // Realistic ¥/㎡ range
    characteristics: ['commercial', 'trendy', 'young-professional'],
  },
  {
    ward: '世田谷区',
    stations: [
      { name: '三軒茶屋', lines: ['東急田園都市線', '東急世田谷線'], lat: 35.6437, lng: 139.6703 },
      { name: '下北沢', lines: ['小田急小田原線', '京王井の頭線'], lat: 35.6610, lng: 139.6682 },
      { name: '二子玉川', lines: ['東急田園都市線', '東急大井町線'], lat: 35.6115, lng: 139.6261 },
    ],
    pricePerSqm: { min: 600000, max: 1500000 },
    characteristics: ['residential', 'family-friendly', 'green'],
  },
  {
    ward: '港区',
    stations: [
      { name: '六本木', lines: ['日比谷線', '都営大江戸線'], lat: 35.6641, lng: 139.7293 },
      { name: '麻布十番', lines: ['南北線', '都営大江戸線'], lat: 35.6554, lng: 139.7372 },
      { name: '白金高輪', lines: ['南北線', '都営三田線'], lat: 35.6433, lng: 139.7336 },
      { name: '品川', lines: ['JR山手線', '京急本線', '東海道新幹線'], lat: 35.6284, lng: 139.7387 },
    ],
    pricePerSqm: { min: 1000000, max: 3500000 },
    characteristics: ['luxury', 'expat-friendly', 'commercial'],
  },
  {
    ward: '目黒区',
    stations: [
      { name: '中目黒', lines: ['東急東横線', '日比谷線'], lat: 35.6440, lng: 139.6987 },
      { name: '自由が丘', lines: ['東急東横線', '東急大井町線'], lat: 35.6076, lng: 139.6693 },
      { name: '学芸大学', lines: ['東急東横線'], lat: 35.6285, lng: 139.6854 },
    ],
    pricePerSqm: { min: 700000, max: 1800000 },
    characteristics: ['residential', 'upscale', 'cafe-culture'],
  },
  {
    ward: '新宿区',
    stations: [
      { name: '新宿', lines: ['JR山手線', '小田急線', '京王線', '丸ノ内線', '都営新宿線', '都営大江戸線'], lat: 35.6896, lng: 139.7006 },
      { name: '神楽坂', lines: ['東西線', '都営大江戸線'], lat: 35.7026, lng: 139.7414 },
      { name: '四谷', lines: ['JR中央線', '丸ノ内線', '南北線'], lat: 35.6860, lng: 139.7300 },
    ],
    pricePerSqm: { min: 750000, max: 2200000 },
    characteristics: ['urban', 'commercial', 'entertainment'],
  },
  {
    ward: '文京区',
    stations: [
      { name: '本郷三丁目', lines: ['丸ノ内線', '都営大江戸線'], lat: 35.7077, lng: 139.7600 },
      { name: '茗荷谷', lines: ['丸ノ内線'], lat: 35.7187, lng: 139.7282 },
      { name: '後楽園', lines: ['丸ノ内線', '南北線'], lat: 35.7079, lng: 139.7510 },
    ],
    pricePerSqm: { min: 700000, max: 1600000 },
    characteristics: ['academic', 'quiet', 'family-friendly'],
  },
  {
    ward: '江東区',
    stations: [
      { name: '豊洲', lines: ['有楽町線', 'ゆりかもめ'], lat: 35.6533, lng: 139.7964 },
      { name: '清澄白河', lines: ['半蔵門線', '都営大江戸線'], lat: 35.6811, lng: 139.8008 },
      { name: '門前仲町', lines: ['東西線', '都営大江戸線'], lat: 35.6726, lng: 139.7966 },
    ],
    pricePerSqm: { min: 500000, max: 1200000 },
    characteristics: ['waterfront', 'developing', 'modern'],
  },
  {
    ward: '中央区',
    stations: [
      { name: '日本橋', lines: ['銀座線', '東西線', '都営浅草線'], lat: 35.6818, lng: 139.7744 },
      { name: '月島', lines: ['有楽町線', '都営大江戸線'], lat: 35.6625, lng: 139.7837 },
      { name: '人形町', lines: ['日比谷線', '都営浅草線'], lat: 35.6860, lng: 139.7830 },
    ],
    pricePerSqm: { min: 800000, max: 2000000 },
    characteristics: ['central', 'business', 'historic'],
  },
] as const;

const BUILDING_TYPES = [
  { type: 'マンション', label: 'マンション', floors: { min: 3, max: 47 }, units: { min: 20, max: 500 } },
  { type: '中古マンション', label: '中古マンション', floors: { min: 3, max: 30 }, units: { min: 15, max: 300 } },
  { type: '新築マンション', label: '新築マンション', floors: { min: 5, max: 47 }, units: { min: 30, max: 500 } },
  { type: '一戸建て', label: '一戸建て', floors: { min: 2, max: 3 }, units: { min: 1, max: 1 } },
] as const;

const CONSTRUCTION_COMPANIES = [
  '大成建設', '鹿島建設', '清水建設', '大林組', '竹中工務店',
  '三井住友建設', '長谷工コーポレーション', '前田建設工業',
  '戸田建設', '五洋建設', '熊谷組', '西松建設',
];

const DEVELOPERS = [
  '三井不動産レジデンシャル', '三菱地所レジデンス', '住友不動産',
  '東急不動産', '野村不動産', '東京建物', '大京',
  'NTT都市開発', '森ビル', 'コスモスイニシア',
];

const LAYOUT_TYPES = [
  { layout: '1R', rooms: 1, minSqm: 15, maxSqm: 25, targetDemo: 'single' },
  { layout: '1K', rooms: 1, minSqm: 18, maxSqm: 28, targetDemo: 'single' },
  { layout: '1LDK', rooms: 1, minSqm: 30, maxSqm: 50, targetDemo: 'single-couple' },
  { layout: '2LDK', rooms: 2, minSqm: 45, maxSqm: 70, targetDemo: 'couple' },
  { layout: '3LDK', rooms: 3, minSqm: 60, maxSqm: 90, targetDemo: 'family' },
  { layout: '4LDK', rooms: 4, minSqm: 75, maxSqm: 120, targetDemo: 'large-family' },
] as const;

// Earthquake resistance standard cutoff — properties built after June 1981
// use 新耐震基準 (new earthquake resistance standards)
const NEW_EARTHQUAKE_STANDARD_DATE = new Date('1981-06-01');

interface GeneratedProperty {
  id: string;
  title: string;
  price: number;
  pricePerSqm: number;
  layout: string;
  exclusiveArea: number;       // 専有面積 (㎡)
  balconyArea: number;         // バルコニー面積 (㎡)
  floor: number;
  totalFloors: number;
  buildingAge: number;
  constructionDate: Date;
  earthquakeStandard: '新耐震' | '旧耐震';
  ward: string;
  nearestStation: string;
  walkMinutes: number;         // 駅徒歩分
  railLines: string[];
  address: string;
  lat: number;
  lng: number;
  buildingType: string;
  developer: string;
  constructor: string;
  structure: string;           // RC造, SRC造, S造, 木造
  totalUnits: number;
  managementFee: number;       // 管理費 (monthly)
  repairReserveFund: number;   // 修繕積立金 (monthly)
  parkingAvailable: boolean;
  parkingFee: number | null;
  features: string[];
  description: string;
  listingDate: Date;
  images: string[];            // placeholder URLs
  floorPlan: string;           // placeholder URL
  status: 'active' | 'under_contract' | 'sold';
}

export function generateProperty(overrides?: Partial<GeneratedProperty>): GeneratedProperty {
  // Pick area weighted toward popular wards
  const area = faker.helpers.weightedArrayElement(
    TOKYO_AREAS.map((a, i) => ({
      value: a,
      weight: [15, 12, 18, 10, 14, 8, 11, 12][i], // Port, Shibuya higher weight
    }))
  );

  const station = faker.helpers.arrayElement(area.stations);
  const buildingType = faker.helpers.arrayElement(BUILDING_TYPES);
  const layout = faker.helpers.arrayElement(LAYOUT_TYPES);

  const exclusiveArea = faker.number.float({
    min: layout.minSqm,
    max: layout.maxSqm,
    fractionDigits: 2,
  });

  // Price correlates with area, station proximity, and building age
  const walkMinutes = faker.number.int({ min: 1, max: 15 });
  const walkDiscount = 1 - (walkMinutes - 1) * 0.015; // closer = more expensive

  const buildingAge = faker.number.int({ min: 0, max: 40 });
  const ageDiscount = 1 - buildingAge * 0.012; // newer = more expensive

  const basePricePerSqm = faker.number.int({
    min: area.pricePerSqm.min,
    max: area.pricePerSqm.max,
  });

  const adjustedPricePerSqm = Math.round(basePricePerSqm * walkDiscount * ageDiscount);
  const price = Math.round((adjustedPricePerSqm * exclusiveArea) / 10000) * 10000; // round to 万

  const constructionDate = new Date();
  constructionDate.setFullYear(constructionDate.getFullYear() - buildingAge);
  constructionDate.setMonth(faker.number.int({ min: 0, max: 11 }));

  const totalFloors = faker.number.int({
    min: buildingType.floors.min,
    max: buildingType.floors.max,
  });

  const floor = faker.number.int({ min: 1, max: totalFloors });

  // Higher floors cost more — add a small premium
  const floorPremium = 1 + (floor / totalFloors) * 0.05;
  const finalPrice = Math.round((price * floorPremium) / 10000) * 10000;

  // Structure based on building type and height
  const structure = totalFloors > 10
    ? faker.helpers.arrayElement(['RC造', 'SRC造'])
    : totalFloors > 3
      ? 'RC造'
      : faker.helpers.arrayElement(['RC造', '木造', '軽量鉄骨造']);

  // Management fees correlate with building size and age
  const managementFee = Math.round(exclusiveArea * faker.number.int({ min: 150, max: 350 }));
  const repairReserveFund = Math.round(exclusiveArea * faker.number.int({ min: 100, max: 300 }));

  // Generate realistic Japanese address
  const chome = faker.number.int({ min: 1, max: 5 });
  const ban = faker.number.int({ min: 1, max: 30 });
  const go = faker.number.int({ min: 1, max: 20 });
  const address = `東京都${area.ward}${station.name}${chome}丁目${ban}番${go}号`;

  // Scatter coordinates slightly around station
  const lat = station.lat + (faker.number.float({ min: -0.008, max: 0.008 }));
  const lng = station.lng + (faker.number.float({ min: -0.008, max: 0.008 }));

  const features = generateFeatures(buildingAge, totalFloors, floor, area.characteristics);

  const id = `prop_${faker.string.nanoid(12)}`;

  return {
    id,
    title: `${area.ward} ${station.name}駅 ${layout.layout} ${buildingType.label}`,
    price: finalPrice,
    pricePerSqm: adjustedPricePerSqm,
    layout: layout.layout,
    exclusiveArea,
    balconyArea: faker.number.float({ min: 3, max: 15, fractionDigits: 2 }),
    floor,
    totalFloors,
    buildingAge,
    constructionDate,
    earthquakeStandard: constructionDate >= NEW_EARTHQUAKE_STANDARD_DATE ? '新耐震' : '旧耐震',
    ward: area.ward,
    nearestStation: station.name,
    walkMinutes,
    railLines: [...station.lines],
    address,
    lat,
    lng,
    buildingType: buildingType.type,
    developer: faker.helpers.arrayElement(DEVELOPERS),
    constructor: faker.helpers.arrayElement(CONSTRUCTION_COMPANIES),
    structure,
    totalUnits: faker.number.int({
      min: buildingType.units.min,
      max: buildingType.units.max,
    }),
    managementFee,
    repairReserveFund,
    parkingAvailable: faker.datatype.boolean(0.4),
    parkingFee: faker.datatype.boolean(0.4) ? faker.number.int({ min: 15000, max: 50000 }) : null,
    features,
    description: generateDescription(area, station, layout, buildingAge, features),
    listingDate: faker.date.recent({ days: 90 }),
    images: Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, (_, i) =>
      `/api/placeholder/property/${id}/image-${i + 1}`
    ),
    floorPlan: `/api/placeholder/property/${id}/floor-plan`,
    status: faker.helpers.weightedArrayElement([
      { value: 'active' as const, weight: 75 },
      { value: 'under_contract' as const, weight: 15 },
      { value: 'sold' as const, weight: 10 },
    ]),
    ...overrides,
  };
}

function generateFeatures(
  buildingAge: number,
  totalFloors: number,
  floor: number,
  areaCharacteristics: readonly string[]
): string[] {
  const features: string[] = [];

  // Common features with probability
  const possibleFeatures = [
    { name: 'オートロック', prob: buildingAge < 20 ? 0.9 : 0.5 },
    { name: '宅配ボックス', prob: buildingAge < 15 ? 0.8 : 0.3 },
    { name: '浴室乾燥機', prob: 0.7 },
    { name: '追い焚き機能', prob: 0.6 },
    { name: 'ウォシュレット', prob: 0.8 },
    { name: '床暖房', prob: buildingAge < 10 ? 0.5 : 0.15 },
    { name: 'ディスポーザー', prob: buildingAge < 10 ? 0.4 : 0.1 },
    { name: '食器洗浄機', prob: buildingAge < 15 ? 0.4 : 0.15 },
    { name: 'ペット可', prob: 0.3 },
    { name: '24時間ゴミ出し可', prob: buildingAge < 20 ? 0.6 : 0.2 },
    { name: 'フロントサービス', prob: totalFloors > 15 ? 0.6 : 0.05 },
    { name: '内廊下', prob: totalFloors > 12 ? 0.5 : 0.1 },
    { name: 'ジム', prob: totalFloors > 20 ? 0.5 : 0.05 },
    { name: 'ラウンジ', prob: totalFloors > 15 ? 0.4 : 0.05 },
    { name: 'ルーフバルコニー', prob: floor === totalFloors ? 0.3 : 0 },
    { name: '角部屋', prob: 0.25 },
    { name: '南向き', prob: 0.35 },
    { name: 'リノベーション済', prob: buildingAge > 15 ? 0.3 : 0 },
    { name: '二重サッシ', prob: 0.3 },
    { name: 'ウォークインクローゼット', prob: buildingAge < 15 ? 0.5 : 0.2 },
  ];

  for (const feature of possibleFeatures) {
    if (Math.random() < feature.prob) {
      features.push(feature.name);
    }
  }

  return features;
}

function generateDescription(
  area: (typeof TOKYO_AREAS)[number],
  station: (typeof TOKYO_AREAS)[number]['stations'][number],
  layout: (typeof LAYOUT_TYPES)[number],
  buildingAge: number,
  features: string[]
): string {
  const lines = station.lines.join('・');
  const walkDesc = `${station.name}駅（${lines}）`;

  let desc = `${area.ward}の${walkDesc}から徒歩圏内の物件です。`;

  if (buildingAge === 0) {
    desc += '新築物件として、最新の設備と耐震基準を備えています。';
  } else if (buildingAge < 10) {
    desc += `築${buildingAge}年の比較的新しい物件です。`;
  } else if (buildingAge < 20) {
    desc += `築${buildingAge}年ですが、管理状態は良好です。`;
  } else {
    desc += `築${buildingAge}年の物件です。`;
    if (features.includes('リノベーション済')) {
      desc += 'リノベーション済みで、室内は新築同様の状態です。';
    }
  }

  if (layout.targetDemo === 'family' || layout.targetDemo === 'large-family') {
    desc += 'ファミリー向けの間取りで、収納も充実しています。';
  } else if (layout.targetDemo === 'couple') {
    desc += 'お二人暮らしにぴったりの間取りです。';
  }

  if (area.characteristics.includes('family-friendly')) {
    desc += '周辺には公園や学校が多く、子育て環境に適しています。';
  }
  if (area.characteristics.includes('trendy')) {
    desc += 'ショッピングやグルメスポットも徒歩圏内に充実しています。';
  }

  return desc;
}

// Generate a full dataset
export function generateDataset(count: number = 500): GeneratedProperty[] {
  return Array.from({ length: count }, () => generateProperty());
}

// Generate price history for market trend charts
export function generatePriceHistory(
  ward: string,
  months: number = 60
): Array<{ date: string; avgPricePerSqm: number; transactions: number }> {
  const area = TOKYO_AREAS.find(a => a.ward === ward) ?? TOKYO_AREAS[0];
  const basePrice = (area.pricePerSqm.min + area.pricePerSqm.max) / 2;

  const history: Array<{ date: string; avgPricePerSqm: number; transactions: number }> = [];
  let currentPrice = basePrice * 0.85; // Start 15% lower for upward trend

  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    // Simulate realistic market trends: generally upward with seasonal variation
    const seasonalFactor = 1 + 0.02 * Math.sin((date.getMonth() / 12) * 2 * Math.PI); // Spring peak
    const trendFactor = 1 + 0.003; // ~0.3% monthly appreciation
    const noise = 1 + (Math.random() - 0.5) * 0.02; // ±1% random noise

    currentPrice = currentPrice * trendFactor * seasonalFactor * noise;

    // Transaction volume: higher in March (fiscal year end) and September
    const baseTransactions = faker.number.int({ min: 30, max: 80 });
    const seasonalTransactions = date.getMonth() === 2 ? 1.5 : date.getMonth() === 8 ? 1.3 : 1;

    history.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM
      avgPricePerSqm: Math.round(currentPrice),
      transactions: Math.round(baseTransactions * seasonalTransactions),
    });
  }

  return history;
}
```

### Tier 2: Placeholder Image Strategy

For property images, don't use generic stock photos. Use a combination approach:

```typescript
// packages/seed/src/generators/images.ts

// Strategy 1: Use placeholder services with property-appropriate dimensions
export function getPropertyImageUrl(
  propertyId: string,
  index: number,
  type: 'exterior' | 'interior' | 'floorplan' | 'view'
): string {
  // In development: use curated Unsplash collections of Japanese apartments
  const collections: Record<string, string> = {
    exterior: '3839885',   // Japanese architecture
    interior: '1163637',   // Modern interiors
    view: '1525943',       // City views
    floorplan: '',         // Generate SVG floor plans
  };

  // Deterministic image per property+index so it's consistent
  const seed = `${propertyId}-${index}`;

  if (type === 'floorplan') {
    return `/api/floorplan/generate?layout=${encodeURIComponent(seed)}`;
  }

  return `https://source.unsplash.com/collection/${collections[type]}/800x600?sig=${seed}`;
}

// Strategy 2: Generate SVG floor plans programmatically
// This is actually very impressive in a portfolio
export function generateFloorPlanSVG(layout: string, sqm: number): string {
  // Simplified — you'd expand this significantly
  const rooms = parseLayout(layout); // '3LDK' → { living: true, dining: true, kitchen: true, rooms: 3 }

  // Generate proportional room rectangles
  // This becomes a fun algorithmic challenge that showcases engineering skill
  // ... SVG generation logic ...

  return svgString;
}
```

### Tier 3: Seed Script with Database Population

```typescript
// packages/seed/src/index.ts

import { generateDataset, generatePriceHistory } from './generators/property';
import { db } from '@repo/database';

async function seed() {
  console.log('🌱 Seeding database...');

  // Generate properties
  const properties = generateDataset(500);
  console.log(`  📍 Generated ${properties.length} properties`);

  // Insert in batches
  const BATCH_SIZE = 50;
  for (let i = 0; i < properties.length; i += BATCH_SIZE) {
    const batch = properties.slice(i, i + BATCH_SIZE);
    await db.insert(schema.properties).values(batch);
    console.log(`  ✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}`);
  }

  // Generate price histories for each ward
  const wards = [...new Set(properties.map(p => p.ward))];
  for (const ward of wards) {
    const history = generatePriceHistory(ward, 60);
    await db.insert(schema.priceHistory).values(
      history.map(h => ({ ward, ...h }))
    );
  }
  console.log(`  📈 Generated price history for ${wards.length} wards`);

  // Generate some user journeys in various states
  await seedUserJourneys();

  // Generate saved searches and favorites
  await seedUserActivity();

  console.log('✅ Seeding complete!');
}

async function seedUserJourneys() {
  // Create demo users at different journey stages
  const journeyStages = [
    { email: 'demo-exploring@example.com', stage: 'exploring', name: '田中太郎' },
    { email: 'demo-searching@example.com', stage: 'actively_searching', name: '佐藤花子' },
    { email: 'demo-evaluating@example.com', stage: 'evaluating', name: '鈴木一郎' },
    { email: 'demo-negotiating@example.com', stage: 'negotiating', name: '高橋美咲' },
  ];

  for (const journey of journeyStages) {
    // Insert user, journey state, and stage-appropriate activity
    // This lets you demo any stage of the journey without going through the whole flow
  }
}

seed().catch(console.error);
```

### What to Put in the README

This is important. Your README should explicitly address the data strategy:

```markdown
## Data Architecture

This project uses **realistic synthetic data** generated by a custom seed engine
(`packages/seed`). The generator produces geographically accurate Tokyo property
listings with:

- Real station/ward locations with correct rail line data
- Statistically realistic pricing correlated to area, station proximity,
  building age, and floor
- Proper Japanese address formatting (丁目番地号)
- Earthquake resistance standard classification (新耐震/旧耐震) based on
  the 1981 building code cutoff
- Seasonal market trend simulation for price history charts

The data ingestion layer (`services/ingestion`) is architected to plug into
real sources (REINS API, portal scraping, government registries) via a
provider-based adapter pattern. See [Data Provider Interface](./docs/data-providers.md).

To seed the database:
```bash
pnpm db:seed        # Generates 500 properties + market data
pnpm db:seed:full   # Generates 2000 properties + complete market data
```
```

This framing shows you understand real data challenges but made a practical decision. Interviewers will respect this far more than a brittle scraper that breaks during a demo.

---

Now let me write out all the missing architecture sections.

---

# Section 9: Localization & Internationalization

## 9.1 i18n Framework

```typescript
// packages/i18n/src/config.ts

export const i18nConfig = {
  defaultLocale: 'ja' as const,
  locales: ['ja', 'en'] as const,
  localePrefixMode: 'as-needed' as const, // Only show /en/ prefix, ja is default
};

export type Locale = (typeof i18nConfig.locales)[number];
```

```typescript
// packages/i18n/src/messages/ja.ts

export default {
  common: {
    search: '検索',
    save: '保存',
    cancel: 'キャンセル',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    retry: '再試行',
    back: '戻る',
    next: '次へ',
    seeMore: 'もっと見る',
    close: '閉じる',
  },

  property: {
    price: '価格',
    layout: '間取り',
    area: '専有面積',
    floor: '所在階',
    age: '築年数',
    station: '最寄り駅',
    walkMinutes: '徒歩{minutes}分',
    managementFee: '管理費',
    repairFund: '修繕積立金',
    newEarthquakeStandard: '新耐震基準',
    oldEarthquakeStandard: '旧耐震基準',
    totalUnits: '総戸数',
    structure: '構造',
    developer: '分譲会社',
    features: '設備・特徴',
    floorPlan: '間取り図',
    priceHistory: '価格推移',
    similarProperties: '類似物件',
    status: {
      active: '販売中',
      under_contract: '契約手続き中',
      sold: '成約済み',
    },
  },

  search: {
    placeholder: 'エリア、駅名、マンション名で検索',
    filters: {
      priceRange: '価格帯',
      priceMin: '下限なし',
      priceMax: '上限なし',
      layout: '間取り',
      area: '面積',
      age: '築年数',
      walkMinutes: '駅徒歩',
      withinMinutes: '{minutes}分以内',
      newOnly: '新耐震基準のみ',
    },
    results: '{count}件の物件が見つかりました',
    noResults: '条件に合う物件が見つかりませんでした',
    sort: {
      recommended: 'おすすめ順',
      priceAsc: '価格が安い順',
      priceDesc: '価格が高い順',
      newest: '新着順',
      areaDesc: '面積が広い順',
      walkMinutes: '駅近い順',
    },
  },

  journey: {
    stages: {
      exploring: '情報収集中',
      actively_searching: '物件検索中',
      evaluating: '物件検討中',
      negotiating: '交渉中',
      contracting: '契約手続き中',
      closing: '引渡し準備中',
      post_purchase: '購入完了',
    },
    actions: {
      scheduleViewing: '内見を予約する',
      requestDocuments: '資料を請求する',
      makeOffer: '購入申込み',
      startContract: '契約手続きを開始',
    },
  },

  ai: {
    assistant: {
      greeting: 'こんにちは！不動産探しのお手伝いをさせていただきます。どのようなお住まいをお探しですか？',
      thinking: '考え中...',
      error: '申し訳ありません。一時的なエラーが発生しました。もう一度お試しください。',
      disclaimer: 'AI による参考情報です。実際のお取引の際は専門家にご相談ください。',
      pricingDisclaimer: 'この価格推定はAIによる参考値です。不動産鑑定評価ではありません。',
    },
    suggestions: {
      askAboutArea: 'このエリアの住みやすさは？',
      compareProperties: 'この物件を比較したい',
      checkPricing: '適正価格を確認したい',
      explainProcess: '購入の流れを教えて',
    },
  },

  format: {
    // Japanese currency formatting rules
    priceInMan: '{value}万円',          // 7,280万円
    priceInOku: '{oku}億{man}万円',     // 1億2,000万円
    priceExact: '{value}円',
    sqm: '{value}㎡',
    tsubo: '{value}坪',
    yearBuilt: '{year}年築',
    ageYears: '築{years}年',
    newConstruction: '新築',
    monthlyFee: '月額{value}円',
  },
} as const;
```

## 9.2 Japanese-Specific Formatting Utilities

```typescript
// packages/i18n/src/formatters/japanese.ts

/**
 * Format price in Japanese convention
 * Below 1億: show in 万円 (e.g., 7,280万円)
 * Above 1億: show in 億万円 (e.g., 1億2,000万円)
 */
export function formatPrice(yen: number): string {
  const man = Math.floor(yen / 10000);

  if (man >= 10000) {
    const oku = Math.floor(man / 10000);
    const remainingMan = man % 10000;

    if (remainingMan === 0) {
      return `${oku}億円`;
    }
    return `${oku}億${remainingMan.toLocaleString('ja-JP')}万円`;
  }

  return `${man.toLocaleString('ja-JP')}万円`;
}

/**
 * Format area with both ㎡ and 坪
 * 1坪 ≈ 3.30579㎡
 */
export function formatArea(sqm: number, showTsubo: boolean = true): string {
  const formatted = `${sqm.toFixed(2)}㎡`;
  if (showTsubo) {
    const tsubo = (sqm / 3.30579).toFixed(2);
    return `${formatted}（${tsubo}坪）`;
  }
  return formatted;
}

/**
 * Format building age
 * 0 years → 新築
 * Otherwise → 築X年
 */
export function formatBuildingAge(years: number): string {
  if (years === 0) return '新築';
  return `築${years}年`;
}

/**
 * Format Japanese address
 * Full: 東京都渋谷区恵比寿1丁目2番3号
 * Short: 渋谷区恵比寿1-2-3
 */
export function formatAddress(
  address: {
    prefecture: string;
    ward: string;
    area: string;
    chome: number;
    ban: number;
    go: number;
    building?: string;
    unit?: string;
  },
  format: 'full' | 'short' = 'full'
): string {
  if (format === 'short') {
    const base = `${address.ward}${address.area}${address.chome}-${address.ban}-${address.go}`;
    return address.building ? `${base} ${address.building}` : base;
  }

  const base = `${address.prefecture}${address.ward}${address.area}${address.chome}丁目${address.ban}番${address.go}号`;
  const withBuilding = address.building ? `${base} ${address.building}` : base;
  return address.unit ? `${withBuilding} ${address.unit}` : withBuilding;
}

/**
 * Format station access
 * e.g., JR山手線「恵比寿」駅 徒歩5分
 */
export function formatStationAccess(
  station: string,
  line: string,
  walkMinutes: number
): string {
  return `${line}「${station}」駅 徒歩${walkMinutes}分`;
}

/**
 * Format Japanese date
 * Supports both Western (2024年3月15日) and Imperial (令和6年3月15日)
 */
export function formatDate(
  date: Date,
  format: 'western' | 'imperial' | 'short' = 'western'
): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (format) {
    case 'imperial':
      return `${toImperialYear(year)}${month}月${day}日`;
    case 'short':
      return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    case 'western':
    default:
      return `${year}年${month}月${day}日`;
  }
}

function toImperialYear(westernYear: number): string {
  if (westernYear >= 2019) return `令和${westernYear - 2018}年`;
  if (westernYear >= 1989) return `平成${westernYear - 1988}年`;
  if (westernYear >= 1926) return `昭和${westernYear - 1925}年`;
  return `${westernYear}年`; // fallback
}

/**
 * Format monthly costs breakdown
 * Used in property detail cards
 */
export function formatMonthlyCosts(costs: {
  managementFee: number;
  repairReserveFund: number;
  parkingFee?: number | null;
}): { label: string; amount: string }[] {
  const items = [
    { label: '管理費', amount: `${costs.managementFee.toLocaleString('ja-JP')}円/月` },
    { label: '修繕積立金', amount: `${costs.repairReserveFund.toLocaleString('ja-JP')}円/月` },
  ];

  if (costs.parkingFee) {
    items.push({
      label: '駐車場',
      amount: `${costs.parkingFee.toLocaleString('ja-JP')}円/月`,
    });
  }

  const total = costs.managementFee + costs.repairReserveFund + (costs.parkingFee ?? 0);
  items.push({
    label: '月額合計',
    amount: `${total.toLocaleString('ja-JP')}円/月`,
  });

  return items;
}
```

## 9.3 AI Language Control

```typescript
// packages/ai/src/prompts/language.ts

export const JAPANESE_AI_SYSTEM_PROMPT = `
あなたは日本の不動産に特化したAIアシスタントです。

言語ルール:
- ユーザーが日本語で話しかけた場合は日本語で応答してください
- ユーザーが英語で話しかけた場合は英語で応答してください
- 丁寧語（です・ます調）を基本としてください
- 専門用語は初出時に簡単な説明を添えてください
  例: 「重要事項説明（じゅうようじこうせつめい：物件の重要な情報を説明する法定手続き）」
- 数値は日本の慣例に従ってください
  - 価格: 万円/億円表記（例：7,280万円、1億2,000万円）
  - 面積: ㎡を主、必要に応じて坪も併記
  - 築年数: 「築X年」または「新築」

重要な注意事項:
- 価格推定を提示する際は必ず「AIによる参考値であり、不動産鑑定評価ではありません」と注記してください
- 法的なアドバイスを求められた場合は、一般的な情報を提供しつつ「詳細は宅地建物取引士にご相談ください」と案内してください
- ユーザーの個人的な財務状況について深く立ち入らないでください
`;
```

---

# Section 10: Error Handling & Edge Case Strategy

## 10.1 Error Taxonomy

```typescript
// packages/shared/src/errors/taxonomy.ts

/**
 * Base error class for the entire application.
 * All custom errors extend this.
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;
  abstract readonly isOperational: boolean; // true = expected, false = bug
  abstract readonly isRetryable: boolean;

  readonly timestamp = new Date();
  readonly context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
  }

  /**
   * User-facing message in Japanese.
   * Never expose internal details.
   */
  abstract getUserMessage(locale: 'ja' | 'en'): string;
}

// ─── Transient Errors (retryable) ──────────────────────────────────

export class ExternalServiceError extends AppError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly httpStatus = 502;
  readonly isOperational = true;
  readonly isRetryable = true;

  constructor(
    public readonly service: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message, { service, ...context });
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? '外部サービスとの通信に一時的な問題が発生しています。しばらくしてからもう一度お試しください。'
      : 'A temporary issue occurred connecting to an external service. Please try again shortly.';
  }
}

export class RateLimitError extends AppError {
  readonly code = 'RATE_LIMIT';
  readonly httpStatus = 429;
  readonly isOperational = true;
  readonly isRetryable = true;

  constructor(
    public readonly retryAfterMs: number,
    context?: Record<string, unknown>
  ) {
    super(`Rate limited. Retry after ${retryAfterMs}ms`, context);
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? 'リクエストが集中しています。少々お待ちください。'
      : 'Too many requests. Please wait a moment.';
  }
}

export class AIProviderError extends AppError {
  readonly code = 'AI_PROVIDER_ERROR';
  readonly httpStatus = 503;
  readonly isOperational = true;
  readonly isRetryable = true;

  constructor(
    public readonly provider: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message, { provider, ...context });
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? 'AIサービスに一時的な問題が発生しています。通常の検索機能は引き続きご利用いただけます。'
      : 'The AI service is temporarily unavailable. Regular search features are still available.';
  }
}

// ─── Permanent Errors (not retryable) ──────────────────────────────

export class PropertyNotFoundError extends AppError {
  readonly code = 'PROPERTY_NOT_FOUND';
  readonly httpStatus = 404;
  readonly isOperational = true;
  readonly isRetryable = false;

  constructor(public readonly propertyId: string) {
    super(`Property not found: ${propertyId}`, { propertyId });
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? 'この物件情報は現在ご利用いただけません。すでに掲載が終了している可能性があります。'
      : 'This property listing is no longer available.';
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly httpStatus = 400;
  readonly isOperational = true;
  readonly isRetryable = false;

  constructor(
    public readonly field: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message, { field, ...context });
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? '入力内容に問題があります。内容を確認してもう一度お試しください。'
      : 'There is an issue with the provided input. Please check and try again.';
  }
}

export class AuthorizationError extends AppError {
  readonly code = 'UNAUTHORIZED';
  readonly httpStatus = 403;
  readonly isOperational = true;
  readonly isRetryable = false;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? 'この操作を行う権限がありません。'
      : 'You do not have permission to perform this action.';
  }
}

export class AILowConfidenceError extends AppError {
  readonly code = 'AI_LOW_CONFIDENCE';
  readonly httpStatus = 200; // Not an HTTP error — still returns data
  readonly isOperational = true;
  readonly isRetryable = false;

  constructor(
    public readonly confidence: number,
    public readonly threshold: number,
    context?: Record<string, unknown>
  ) {
    super(`AI confidence ${confidence} below threshold ${threshold}`, {
      confidence,
      threshold,
      ...context,
    });
  }

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? 'この推定は十分なデータに基づいていないため、参考程度にご覧ください。'
      : 'This estimate is based on limited data. Please treat it as a rough reference only.';
  }
}

// ─── Unexpected Errors (bugs) ──────────────────────────────────────

export class InternalError extends AppError {
  readonly code = 'INTERNAL_ERROR';
  readonly httpStatus = 500;
  readonly isOperational = false; // This is a bug
  readonly isRetryable = false;

  getUserMessage(locale: 'ja' | 'en') {
    return locale === 'ja'
      ? '予期しないエラーが発生しました。問題が続く場合はサポートまでお問い合わせください。'
      : 'An unexpected error occurred. Please contact support if the issue persists.';
  }
}
```

## 10.2 Circuit Breaker Configuration

```typescript
// packages/shared/src/resilience/circuit-breaker.ts

import CircuitBreaker from 'opossum';

interface CircuitBreakerConfig {
  timeout: number;           // ms before a request is considered failed
  errorThresholdPercentage: number;  // error rate to trip circuit
  resetTimeout: number;      // ms before attempting to close circuit
  volumeThreshold: number;   // minimum requests before tripping
}

// Per-dependency configurations
export const CIRCUIT_BREAKER_CONFIGS: Record<string, CircuitBreakerConfig> = {
  // LLM provider — generous timeout, quick fallback
  'ai-provider': {
    timeout: 30000,            // 30s — LLM can be slow
    errorThresholdPercentage: 50,
    resetTimeout: 30000,       // Try again after 30s
    volumeThreshold: 5,
  },

  // Property search — fast, critical path
  'property-search': {
    timeout: 5000,
    errorThresholdPercentage: 30,
    resetTimeout: 10000,
    volumeThreshold: 10,
  },

  // Geocoding API
  'geocoding': {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 60000,       // Geocoding failures are less critical
    volumeThreshold: 5,
  },

  // LINE Messaging API
  'line-api': {
    timeout: 10000,
    errorThresholdPercentage: 40,
    resetTimeout: 30000,
    volumeThreshold: 5,
  },
};

export function createCircuitBreaker<T>(
  name: string,
  action: (...args: unknown[]) => Promise<T>,
  fallback?: (...args: unknown[]) => T
): CircuitBreaker<unknown[], T> {
  const config = CIRCUIT_BREAKER_CONFIGS[name] ?? {
    timeout: 10000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
    volumeThreshold: 5,
  };

  const breaker = new CircuitBreaker(action, {
    ...config,
    name,
  });

  if (fallback) {
    breaker.fallback(fallback);
  }

  // Observability hooks
  breaker.on('open', () => {
    console.warn(`[CircuitBreaker] ${name}: OPEN — requests will be short-circuited`);
    // Emit metric: circuit_breaker_state{name, state="open"}
  });

  breaker.on('halfOpen', () => {
    console.info(`[CircuitBreaker] ${name}: HALF-OPEN — testing recovery`);
  });

  breaker.on('close', () => {
    console.info(`[CircuitBreaker] ${name}: CLOSED — recovered`);
  });

  return breaker;
}
```

## 10.3 Graceful Degradation Rules

```typescript
// packages/shared/src/resilience/degradation.ts

/**
 * Defines what each feature falls back to when dependencies fail.
 *
 * Principle: The user should always see *something* useful.
 * Never show a blank screen or generic error.
 */
export const DEGRADATION_RULES = {
  /**
   * AI Chat Assistant
   * Primary: LLM-powered conversational AI
   * Degraded: Template-based responses + search fallback
   */
  'ai-chat': {
    dependencies: ['ai-provider'],
    degradedBehavior: 'template-responses',
    userNotice: {
      ja: 'AIアシスタントは現在メンテナンス中です。基本的な検索機能でお探しの物件を見つけることができます。',
      en: 'The AI assistant is currently under maintenance. You can still find properties using our search features.',
    },
    showNotice: true,
  },

  /**
   * Price Estimation
   * Primary: ML model prediction
   * Degraded: Statistical average for ward/layout (pre-computed)
   */
  'price-estimation': {
    dependencies: ['ai-provider', 'property-search'],
    degradedBehavior: 'statistical-fallback',
    userNotice: {
      ja: '詳細な価格推定は現在利用できません。エリア平均価格を参考値として表示しています。',
      en: 'Detailed price estimates are currently unavailable. Showing area average prices as reference.',
    },
    showNotice: true,
  },

  /**
   * Property Search
   * Primary: Elasticsearch with AI-enhanced ranking
   * Degraded: Direct PostgreSQL query with basic ranking
   */
  'property-search': {
    dependencies: ['property-search'],
    degradedBehavior: 'database-fallback',
    userNotice: {
      ja: '検索結果の精度が一時的に低下している可能性があります。',
      en: 'Search results may be less accurate than usual.',
    },
    showNotice: false, // Don't alarm users — DB search is still good
  },

  /**
   * Map View
   * Primary: Interactive map with property pins
   * Degraded: List view with station-based grouping
   */
  'map-view': {
    dependencies: ['geocoding'],
    degradedBehavior: 'list-fallback',
    userNotice: {
      ja: '地図表示は現在利用できません。リスト表示で物件をご覧いただけます。',
      en: 'Map view is currently unavailable. Properties are shown in list view.',
    },
    showNotice: true,
  },

  /**
   * Notifications (LINE)
   * Primary: LINE push notifications
   * Degraded: In-app notifications + email
   */
  'line-notifications': {
    dependencies: ['line-api'],
    degradedBehavior: 'email-fallback',
    userNotice: null, // Silent fallback — user gets notified by other means
    showNotice: false,
  },
} as const;
```

## 10.4 Empty State & Error UI Components

```typescript
// packages/ui/src/components/feedback/empty-state.tsx

import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant: 'no-results' | 'error' | 'degraded' | 'empty';
}

export function EmptyState({ icon, title, description, action, variant }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center mb-4',
        {
          'bg-neutral-100 text-neutral-400': variant === 'no-results' || variant === 'empty',
          'bg-red-50 text-red-400': variant === 'error',
          'bg-amber-50 text-amber-500': variant === 'degraded',
        }
      )}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios
export const PropertyEmptyStates = {
  noSearchResults: (onAdjustFilters: () => void) => (
    <EmptyState
      icon={<SearchIcon />}
      variant="no-results"
      title="条件に合う物件が見つかりませんでした"
      description="検索条件を変更するか、エリアを広げてお試しください。"
      action={{ label: '条件を変更する', onClick: onAdjustFilters }}
    />
  ),

  searchError: (onRetry: () => void) => (
    <EmptyState
      icon={<AlertIcon />}
      variant="error"
      title="検索中にエラーが発生しました"
      description="一時的な問題が発生しています。しばらくしてからもう一度お試しください。"
      action={{ label: '再試行', onClick: onRetry }}
    />
  ),

  aiDegraded: () => (
    <EmptyState
      icon={<InfoIcon />}
      variant="degraded"
      title="AI機能は現在制限されています"
      description="基本的な検索機能は通常通りご利用いただけます。AIによるおすすめ機能は一時的に利用できません。"
    />
  ),

  noSavedProperties: () => (
    <EmptyState
      icon={<HeartIcon />}
      variant="empty"
      title="保存した物件はまだありません"
      description="気になる物件のハートマークをタップすると、ここに保存されます。"
    />
  ),
};
```

---

# Section 11: Testing Strategy

## 11.1 Testing Pyramid

```
                    ┌──────────┐
                    │   E2E    │  ~50 tests
                    │Playwright│  Critical user journeys
                   ─┼──────────┼─
                  ╱  Integration  ╲  ~200 tests
                ╱   API + Agent    ╲  Service boundaries
              ─┼────────────────────┼─
             ╱     Component Tests     ╲  ~500 tests
           ╱    Storybook + Testing Lib   ╲  UI components
         ─┼────────────────────────────────┼─
        ╱            Unit Tests               ╲  ~1000+ tests
      ╱   Formatters, validators, business      ╲  Pure functions
    ─┼──────────────────────────────────────────────┼─
     AI Evaluation Harness (separate pipeline)
     Golden datasets, regression benchmarks
```

## 11.2 Unit Testing

```typescript
// packages/i18n/src/__tests__/formatters.test.ts

import { describe, it, expect } from 'vitest';
import { formatPrice, formatArea, formatBuildingAge, formatAddress } from '../formatters/japanese';

describe('formatPrice', () => {
  it('formats prices under 1億 in 万円', () => {
    expect(formatPrice(72800000)).toBe('7,280万円');
    expect(formatPrice(35000000)).toBe('3,500万円');
    expect(formatPrice(9800000)).toBe('980万円');
  });

  it('formats prices at exactly 1億', () => {
    expect(formatPrice(100000000)).toBe('1億円');
  });

  it('formats prices over 1億 in 億万円', () => {
    expect(formatPrice(120000000)).toBe('1億2,000万円');
    expect(formatPrice(350000000)).toBe('3億5,000万円');
  });

  it('handles edge case of exactly X億 with no remainder', () => {
    expect(formatPrice(200000000)).toBe('2億円');
  });
});

describe('formatArea', () => {
  it('shows ㎡ only when tsubo disabled', () => {
    expect(formatArea(65.5, false)).toBe('65.50㎡');
  });

  it('shows both ㎡ and 坪 by default', () => {
    expect(formatArea(65.5)).toBe('65.50㎡（19.81坪）');
  });
});

describe('formatBuildingAge', () => {
  it('shows 新築 for age 0', () => {
    expect(formatBuildingAge(0)).toBe('新築');
  });

  it('shows 築X年 for other ages', () => {
    expect(formatBuildingAge(15)).toBe('築15年');
  });
});
```

```typescript
// packages/domain/src/__tests__/fee-calculator.test.ts

import { describe, it, expect } from 'vitest';
import { calculateBrokerageFee } from '../rules/fees';

describe('calculateBrokerageFee', () => {
  // Japanese brokerage fee legal maximums:
  // ¥2M or less: 5% + tax
  // ¥2M–¥4M: 4% + tax
  // Over ¥4M: 3% + 6万 + tax (simplified formula)

  it('calculates fee for property over ¥4M using simplified formula', () => {
    // 7,000万円 → 3% + 6万 = 216万円 + tax
    const result = calculateBrokerageFee(70000000);
    expect(result.feeBeforeTax).toBe(2160000);
    expect(result.tax).toBe(216000); // 10% consumption tax
    expect(result.totalFee).toBe(2376000);
  });

  it('calculates fee for property between ¥2M–¥4M', () => {
    const result = calculateBrokerageFee(3000000);
    // Tiered: (200万 × 5%) + (100万 × 4%) = 14万
    expect(result.feeBeforeTax).toBe(140000);
  });

  it('calculates fee for property under ¥2M', () => {
    const result = calculateBrokerageFee(1500000);
    expect(result.feeBeforeTax).toBe(75000); // 150万 × 5%
  });

  it('these are maximum fees — actual may be lower', () => {
    const result = calculateBrokerageFee(70000000);
    expect(result.isMaximum).toBe(true);
  });
});
```

## 11.3 Component Testing

```typescript
// packages/ui/src/components/property/__tests__/property-card.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyCard } from '../property-card';
import { generateProperty } from '@repo/seed';

describe('PropertyCard', () => {
  const mockProperty = generateProperty({
    price: 72800000,
    layout: '3LDK',
    exclusiveArea: 68.5,
    ward: '渋谷区',
    nearestStation: '恵比寿',
    walkMinutes: 5,
    buildingAge: 12,
    earthquakeStandard: '新耐震',
  });

  it('displays price in 万円 format', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('7,280万円')).toBeInTheDocument();
  });

  it('displays layout and area', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('3LDK')).toBeInTheDocument();
    expect(screen.getByText(/68\.50㎡/)).toBeInTheDocument();
  });

  it('displays station access info', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/恵比寿駅/)).toBeInTheDocument();
    expect(screen.getByText(/徒歩5分/)).toBeInTheDocument();
  });

  it('shows 新耐震 badge for post-1981 buildings', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('新耐震')).toBeInTheDocument();
  });

  it('shows 旧耐震 warning for pre-1981 buildings', () => {
    const oldProperty = generateProperty({
      ...mockProperty,
      earthquakeStandard: '旧耐震',
      buildingAge: 45,
    });
    render(<PropertyCard property={oldProperty} />);
    expect(screen.getByText('旧耐震')).toBeInTheDocument();
    // Should have warning styling
    expect(screen.getByText('旧耐震').closest('span')).toHaveClass('bg-amber-100');
  });

  it('calls onSave when heart icon is clicked', async () => {
    const onSave = vi.fn();
    render(<PropertyCard property={mockProperty} onSave={onSave} />);
    await userEvent.click(screen.getByLabelText('物件を保存'));
    expect(onSave).toHaveBeenCalledWith(mockProperty.id);
  });

  it('shows 成約済み overlay for sold properties', () => {
    const soldProperty = generateProperty({ ...mockProperty, status: 'sold' });
    render(<PropertyCard property={soldProperty} />);
    expect(screen.getByText('成約済み')).toBeInTheDocument();
  });
});
```

## 11.4 Integration Testing

```typescript
// services/api/src/__tests__/property-search.integration.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestApp } from '../test-utils/app';
import { seedTestDatabase } from '../test-utils/seed';

describe('Property Search API', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await createTestApp();
    await seedTestDatabase(app.db, { properties: 100 });
  });

  afterAll(async () => {
    await app.cleanup();
  });

  it('searches by ward and returns formatted results', async () => {
    const response = await app.request('/api/properties/search', {
      method: 'POST',
      body: JSON.stringify({
        ward: '渋谷区',
        limit: 10,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.length).toBeLessThanOrEqual(10);
    expect(data.results.every((p: any) => p.ward === '渋谷区')).toBe(true);
    expect(data.total).toBeGreaterThanOrEqual(data.results.length);
  });

  it('filters by price range', async () => {
    const response = await app.request('/api/properties/search', {
      method: 'POST',
      body: JSON.stringify({
        priceMin: 30000000,
        priceMax: 50000000,
      }),
    });

    const data = await response.json();
    expect(data.results.every((p: any) =>
      p.price >= 30000000 && p.price <= 50000000
    )).toBe(true);
  });

  it('filters by earthquake standard', async () => {
    const response = await app.request('/api/properties/search', {
      method: 'POST',
      body: JSON.stringify({
        earthquakeStandard: '新耐震',
      }),
    });

    const data = await response.json();
    expect(data.results.every((p: any) =>
      p.earthquakeStandard === '新耐震'
    )).toBe(true);
  });

  it('returns degraded results when search service is down', async () => {
    // Simulate Elasticsearch outage
    await app.mockService('elasticsearch', { status: 'down' });

    const response = await app.request('/api/properties/search', {
      method: 'POST',
      body: JSON.stringify({ ward: '渋谷区' }),
    });

    // Should still return results (from DB fallback)
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.meta.degraded).toBe(true);

    await app.mockService('elasticsearch', { status: 'up' });
  });
});
```

## 11.5 AI Evaluation Harness

```typescript
// packages/ai/src/__tests__/evaluation/pricing-accuracy.eval.ts

import { describe, it, expect } from 'vitest';
import { estimatePrice } from '../../models/pricing';

/**
 * Golden dataset: properties with known sale prices.
 * In production, this would come from historical transaction data.
 * For portfolio: hand-crafted realistic examples.
 */
const GOLDEN_DATASET = [
  {
    id: 'eval-001',
    description: '渋谷区 恵比寿駅徒歩3分 3LDK 72㎡ 築10年 新耐震 RC造 15階建て8階',
    knownPrice: 89800000,    // Realistic for this spec
    acceptableRange: { min: 75000000, max: 105000000 }, // ±~15%
  },
  {
    id: 'eval-002',
    description: '世田谷区 三軒茶屋駅徒歩7分 2LDK 55㎡ 築25年 新耐震 RC造 7階建て3階',
    knownPrice: 42800000,
    acceptableRange: { min: 36000000, max: 50000000 },
  },
  {
    id: 'eval-003',
    description: '港区 六本木駅徒歩5分 1LDK 45㎡ 築5年 新耐震 SRC造 32階建て20階',
    knownPrice: 98000000,
    acceptableRange: { min: 83000000, max: 115000000 },
  },
  // ... more golden examples
];

describe('Price Estimation Accuracy', () => {
  let totalError = 0;
  let withinRange = 0;

  for (const example of GOLDEN_DATASET) {
    it(`estimates ${example.id} within acceptable range`, async () => {
      const result = await estimatePrice(example.description);

      const errorPct = Math.abs(result.estimatedPrice - example.knownPrice) / example.knownPrice;
      totalError += errorPct;

      expect(result.estimatedPrice).toBeGreaterThanOrEqual(example.acceptableRange.min);
      expect(result.estimatedPrice).toBeLessThanOrEqual(example.acceptableRange.max);

      if (
        result.estimatedPrice >= example.acceptableRange.min &&
        result.estimatedPrice <= example.acceptableRange.max
      ) {
        withinRange++;
      }
    });
  }

  it('has mean absolute percentage error under 20%', () => {
    const mape = totalError / GOLDEN_DATASET.length;
    expect(mape).toBeLessThan(0.2);
  });

  it('has at least 80% of estimates within acceptable range', () => {
    const accuracy = withinRange / GOLDEN_DATASET.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});
```

## 11.6 E2E Testing

```typescript
// apps/web/e2e/buyer-journey.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Buyer Journey — Full Flow', () => {
  test('complete journey from search to property evaluation', async ({ page }) => {
    // 1. Land on homepage
    await page.goto('/');
    await expect(page.getByText('理想の住まいを見つけよう')).toBeVisible();

    // 2. Search for properties
    await page.getByPlaceholder('エリア、駅名、マンション名で検索').fill('渋谷区');
    await page.getByRole('button', { name: '検索' }).click();

    // 3. Verify search results
    await expect(page.getByText(/件の物件が見つかりました/)).toBeVisible();
    const propertyCards = page.getByTestId('property-card');
    await expect(propertyCards.first()).toBeVisible();

    // 4. Apply filters
    await page.getByRole('button', { name: '間取り' }).click();
    await page.getByLabel('3LDK').check();
    await page.getByRole('button', { name: '適用' }).click();

    // Verify filtered results
    await expect(propertyCards.first()).toContainText('3LDK');

    // 5. Click into property detail
    await propertyCards.first().click();
    await expect(page.getByTestId('property-detail')).toBeVisible();

    // 6. Verify key information is displayed correctly
    await expect(page.getByText(/万円/)).toBeVisible();  // Price
    await expect(page.getByText(/㎡/)).toBeVisible();     // Area
    await expect(page.getByText(/築\d+年|新築/)).toBeVisible(); // Building age

    // 7. Open AI chat
    await page.getByRole('button', { name: 'AIに相談' }).click();
    await expect(page.getByTestId('chat-panel')).toBeVisible();

    // 8. Ask AI about the property
    await page.getByPlaceholder('メッセージを入力').fill('この物件の適正価格は？');
    await page.getByRole('button', { name: '送信' }).click();

    // 9. Verify AI responds (with disclaimer)
    const aiResponse = page.getByTestId('ai-message').last();
    await expect(aiResponse).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/AIによる参考値/)).toBeVisible(); // Disclaimer present

    // 10. Save property
    await page.getByRole('button', { name: '物件を保存' }).click();
    await expect(page.getByText('保存しました')).toBeVisible();
  });

  test('handles search with no results gracefully', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('エリア、駅名、マンション名で検索').fill('存在しないエリア');
    await page.getByRole('button', { name: '検索' }).click();

    await expect(page.getByText('条件に合う物件が見つかりませんでした')).toBeVisible();
    await expect(page.getByRole('button', { name: '条件を変更する' })).toBeVisible();
  });
});
```

## 11.7 Test Configuration

```typescript
// vitest.workspace.ts

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Unit tests for shared packages
  {
    test: {
      name: 'packages',
      include: ['packages/*/src/**/*.test.ts'],
      environment: 'node',
      coverage: {
        provider: 'v8',
        thresholds: {
          statements: 85,
          branches: 80,
          functions: 85,
          lines: 85,
        },
      },
    },
  },

  // Component tests
  {
    test: {
      name: 'components',
      include: ['packages/ui/src/**/*.test.tsx'],
      environment: 'jsdom',
      setupFiles: ['./test-setup/dom.ts'],
    },
  },

  // API integration tests
  {
    test: {
      name: 'integration',
      include: ['services/*/src/**/*.integration.test.ts'],
      environment: 'node',
      globalSetup: ['./test-setup/database.ts'],
      testTimeout: 30000,
    },
  },

  // AI evaluation tests (separate — slow and expensive)
  {
    test: {
      name: 'ai-eval',
      include: ['packages/ai/src/**/*.eval.ts'],
      environment: 'node',
      testTimeout: 120000,
      // Only run in CI or explicitly
      ...(process.env.RUN_AI_EVAL ? {} : { skip: true }),
    },
  },
]);
```

---

# Section 12: Business Logic & Domain Rules

## 12.1 Domain Rules Engine

```typescript
// packages/domain/src/rules/fees.ts

/**
 * Japanese Real Estate Brokerage Fee Calculator
 *
 * Legal basis: 宅地建物取引業法 第46条
 * (Real Estate Brokerage Act, Article 46)
 *
 * Maximum brokerage fees:
 *   Sale price ≤ ¥2,000,000:  5.5% (5% + consumption tax)
 *   ¥2,000,001–¥4,000,000:   4.4% (4% + consumption tax)
 *   Sale price > ¥4,000,000:  3.3% (3% + consumption tax)
 *
 * Simplified formula for > ¥4M:
 *   (Sale price × 3% + ¥60,000) × 1.10 (consumption tax)
 */

const CONSUMPTION_TAX_RATE = 0.10;

interface BrokerageFeeResult {
  feeBeforeTax: number;
  tax: number;
  totalFee: number;
  isMaximum: boolean;        // These are legal maximums; actual fees may be negotiated lower
  breakdown: {
    tier: string;
    amount: number;
    rate: number;
  }[];
  legalBasis: string;
}

export function calculateBrokerageFee(salePrice: number): BrokerageFeeResult {
  let feeBeforeTax: number;
  const breakdown: BrokerageFeeResult['breakdown'] = [];

  if (salePrice <= 2000000) {
    feeBeforeTax = salePrice * 0.05;
    breakdown.push({
      tier: '200万円以下の部分',
      amount: feeBeforeTax,
      rate: 0.05,
    });
  } else if (salePrice <= 4000000) {
    const tier1 = 2000000 * 0.05;
    const tier2 = (salePrice - 2000000) * 0.04;
    feeBeforeTax = tier1 + tier2;
    breakdown.push(
      { tier: '200万円以下の部分', amount: tier1, rate: 0.05 },
      { tier: '200万円超400万円以下の部分', amount: tier2, rate: 0.04 },
    );
  } else {
    // Simplified formula: price × 3% + 6万
    feeBeforeTax = salePrice * 0.03 + 60000;
    breakdown.push(
      { tier: '200万円以下の部分', amount: 100000, rate: 0.05 },
      { tier: '200万円超400万円以下の部分', amount: 80000, rate: 0.04 },
      { tier: '400万円超の部分', amount: (salePrice - 4000000) * 0.03, rate: 0.03 },
    );
  }

  const tax = Math.floor(feeBeforeTax * CONSUMPTION_TAX_RATE);

  return {
    feeBeforeTax,
    tax,
    totalFee: feeBeforeTax + tax,
    isMaximum: true,
    breakdown,
    legalBasis: '宅地建物取引業法 第46条 / 国土交通省告示',
  };
}
```

```typescript
// packages/domain/src/rules/transaction.ts

/**
 * Japanese Property Transaction Rules
 *
 * This module encodes the legally mandated steps and business rules
 * for buying residential property in Japan.
 */

/**
 * Earnest Money (手付金 / tetsuke-kin) Rules
 *
 * Legal basis: 宅地建物取引業法 第39条
 * - Cannot exceed 20% of sale price when seller is a licensed agent
 * - Typically 5-10% in practice
 * - Buyer can forfeit 手付金 to cancel before contract performance
 * - Seller must return double 手付金 to cancel (手付倍返し)
 */
export function calculateEarnestMoneyRange(salePrice: number): {
  minimum: number;
  typical: number;
  maximum: number;
  legalMaximumPercent: number;
} {
  return {
    minimum: Math.round(salePrice * 0.05),
    typical: Math.round(salePrice * 0.10),
    maximum: Math.round(salePrice * 0.20),
    legalMaximumPercent: 20,
  };
}

/**
 * Transaction Cost Breakdown
 *
 * All the costs beyond the purchase price that a buyer should budget for.
 */
export function calculateTransactionCosts(params: {
  salePrice: number;
  isNewConstruction: boolean;
  loanAmount: number;
  fixedPropertyTaxAssessment: number; // 固定資産税評価額
}): TransactionCostBreakdown {
  const { salePrice, isNewConstruction, loanAmount, fixedPropertyTaxAssessment } = params;

  const brokerage = calculateBrokerageFee(salePrice);

  // Registration taxes (登録免許税)
  // Ownership transfer: assessed value × 2% (reduced to 0.3% for residential until 2027)
  const ownershipTransferTax = Math.floor(fixedPropertyTaxAssessment * 0.003);

  // Mortgage registration: loan amount × 0.4% (reduced to 0.1% for residential)
  const mortgageRegistrationTax = Math.floor(loanAmount * 0.001);

  // Stamp duty (印紙税) on contract
  const stampDuty = calculateStampDuty(salePrice);

  // Consumption tax (消費税) — only on building portion of new construction
  // Land is exempt from consumption tax in Japan
  const consumptionTax = isNewConstruction ? Math.floor(salePrice * 0.5 * CONSUMPTION_TAX_RATE) : 0;
  // Note: 0.5 is rough estimate of building vs. land ratio — varies significantly

  // Judicial scrivener fees (司法書士報酬)
  const judicialScrivenerFee = 150000; // Typical range: ¥100,000–¥200,000

  // Mortgage-related costs
  const loanOriginationFee = Math.floor(loanAmount * 0.022); // Typical 2.2%
  const mortgageInsurance = loanAmount > salePrice * 0.8
    ? Math.floor(loanAmount * 0.002) // Required if LTV > 80%
    : 0;

  // Fire insurance (火災保険) — required for mortgage
  const fireInsurance = 200000; // Rough annual estimate for a Tokyo apartment

  // Fixed property tax proration (固定資産税精算金)
  // Buyer pays seller's remaining annual tax from transfer date
  const propertyTaxProration = Math.floor(fixedPropertyTaxAssessment * 0.014 * 0.5); // ~half year typical

  return {
    purchasePrice: salePrice,
    brokerageFee: brokerage.totalFee,
    registrationTaxes: {
      ownershipTransfer: ownershipTransferTax,
      mortgageRegistration: mortgageRegistrationTax,
      stampDuty,
    },
    consumptionTax,
    professionalFees: {
      judicialScrivener: judicialScrivenerFee,
    },
    loanCosts: {
      originationFee: loanOriginationFee,
      mortgageInsurance,
    },
    insurance: {
      fireInsurance,
    },
    taxProration: propertyTaxProration,
    totalAdditionalCosts:
      brokerage.totalFee +
      ownershipTransferTax +
      mortgageRegistrationTax +
      stampDuty +
      consumptionTax +
      judicialScrivenerFee +
      loanOriginationFee +
      mortgageInsurance +
      fireInsurance +
      propertyTaxProration,
    percentOfPurchasePrice: 0, // Calculated below
  };
}

/**
 * Stamp Duty (印紙税) Schedule
 * Based on contract value, with reduced rates for real estate contracts until 2027
 */
function calculateStampDuty(contractValue: number): number {
  // Reduced rates for real estate transaction contracts
  if (contractValue <= 1000000) return 500;
  if (contractValue <= 5000000) return 1000;
  if (contractValue <= 10000000) return 5000;
  if (contractValue <= 50000000) return 10000;
  if (contractValue <= 100000000) return 30000;
  if (contractValue <= 500000000) return 60000;
  if (contractValue <= 1000000000) return 160000;
  return 320000;
}

interface TransactionCostBreakdown {
  purchasePrice: number;
  brokerageFee: number;
  registrationTaxes: {
    ownershipTransfer: number;
    mortgageRegistration: number;
    stampDuty: number;
  };
  consumptionTax: number;
  professionalFees: {
    judicialScrivener: number;
  };
  loanCosts: {
    originationFee: number;
    mortgageInsurance: number;
  };
  insurance: {
    fireInsurance: number;
  };
  taxProration: number;
  totalAdditionalCosts: number;
  percentOfPurchasePrice: number;
}
```

```typescript
// packages/domain/src/rules/property-assessment.ts

/**
 * Property Risk Assessment Rules
 *
 * Flags potential risks that the AI assistant and UI should surface
 * prominently to buyers.
 */

interface PropertyRisk {
  code: string;
  severity: 'info' | 'warning' | 'critical';
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  recommendation: { ja: string; en: string };
}

export function assessPropertyRisks(property: {
  constructionDate: Date;
  structure: string;
  ward: string;
  lat: number;
  lng: number;
  totalFloors: number;
  buildingAge: number;
  features: string[];
}): PropertyRisk[] {
  const risks: PropertyRisk[] = [];

  // 1. Earthquake resistance standard check
  const NEW_EARTHQUAKE_STANDARD = new Date('1981-06-01');
  if (property.constructionDate < NEW_EARTHQUAKE_STANDARD) {
    risks.push({
      code: 'OLD_EARTHQUAKE_STANDARD',
      severity: 'critical',
      title: {
        ja: '旧耐震基準の建物です',
        en: 'Built under old earthquake resistance standards',
      },
      description: {
        ja: 'この建物は1981年6月以前の旧耐震基準で建築されています。新耐震基準と比べて耐震性能が劣る可能性があります。',
        en: 'This building was constructed before June 1981 under older earthquake resistance standards.',
      },
      recommendation: {
        ja: '耐震診断の実施状況と、耐震補強工事の有無を確認することをお勧めします。',
        en: 'We recommend checking if a seismic assessment has been conducted and whether reinforcement work has been done.',
      },
    });
  }

  // 2. Building age and major repair concerns
  if (property.buildingAge >= 30 && !property.features.includes('大規模修繕済')) {
    risks.push({
      code: 'MAJOR_REPAIR_DUE',
      severity: 'warning',
      title: {
        ja: '大規模修繕の時期を確認してください',
        en: 'Check major renovation schedule',
      },
      description: {
        ja: `築${property.buildingAge}年が経過しています。大規模修繕工事の実施履歴と今後の計画、修繕積立金の状況を確認することをお勧めします。`,
        en: `The building is ${property.buildingAge} years old. Check the history and future plans for major renovations, and the repair reserve fund status.`,
      },
      recommendation: {
        ja: '管理組合の長期修繕計画書と修繕積立金の残高を確認してください。',
        en: 'Request the long-term repair plan and current repair reserve fund balance from the management association.',
      },
    });
  }

  // 3. Wooden structure in dense area (fire risk)
  if (property.structure === '木造' && property.totalFloors <= 3) {
    risks.push({
      code: 'WOODEN_STRUCTURE',
      severity: 'info',
      title: {
        ja: '木造建築です',
        en: 'Wooden structure',
      },
      description: {
        ja: '木造建築のため、RC造やSRC造と比べて耐火性能と遮音性能が劣る場合があります。',
        en: 'As a wooden structure, fire resistance and sound insulation may be lower compared to reinforced concrete buildings.',
      },
      recommendation: {
        ja: '火災保険の内容と周辺の防火状況を確認してください。',
        en: 'Check fire insurance details and surrounding fire safety conditions.',
      },
    });
  }

  // 4. High-rise specific concerns
  if (property.totalFloors >= 20) {
    risks.push({
      code: 'HIGH_RISE_CONSIDERATIONS',
      severity: 'info',
      title: {
        ja: 'タワーマンション固有の注意点',
        en: 'High-rise specific considerations',
      },
      description: {
        ja: '高層マンションは管理費・修繕積立金が高くなる傾向があり、大規模修繕工事の費用も大きくなります。',
        en: 'High-rise condominiums tend to have higher management fees and repair reserves, with more expensive major renovation costs.',
      },
      recommendation: {
        ja: '修繕積立金の値上げ予定と長期修繕計画の内容を確認してください。',
        en: 'Check for planned increases in repair reserves and review the long-term renovation plan.',
      },
    });
  }

  return risks;
}
```

## 12.2 Transaction State Enforcement

```typescript
// packages/domain/src/rules/journey-guards.ts

/**
 * Journey Stage Transition Guards
 *
 * These enforce business rules about what must be true
 * before a buyer can advance to the next stage.
 * Used by the XState state machine.
 */

import type { JourneyContext } from '../types';

export const journeyGuards = {
  /**
   * Can move from 'exploring' to 'actively_searching'
   * Requires: basic preferences set
   */
  canStartSearching: (context: JourneyContext): boolean => {
    return (
      context.preferences !== null &&
      context.preferences.budgetMax > 0 &&
      (context.preferences.preferredAreas.length > 0 ||
        context.preferences.preferredStations.length > 0)
    );
  },

  /**
   * Can move from 'actively_searching' to 'evaluating'
   * Requires: at least one property shortlisted
   */
  canStartEvaluating: (context: JourneyContext): boolean => {
    return context.shortlistedProperties.length > 0;
  },

  /**
   * Can move from 'evaluating' to 'negotiating'
   * Requires: target property selected, pre-approval (if using mortgage)
   */
  canStartNegotiating: (context: JourneyContext): boolean => {
    if (!context.targetProperty) return false;

    // If using mortgage, must have pre-approval
    if (context.financingType === 'mortgage') {
      return context.mortgagePreApproval !== null && context.mortgagePreApproval.status === 'approved';
    }

    // Cash buyers can proceed directly
    return true;
  },

  /**
   * Can move from 'negotiating' to 'contracting'
   * Requires: offer accepted, 重要事項説明 completed
   */
  canStartContracting: (context: JourneyContext): boolean => {
    return (
      context.offerStatus === 'accepted' &&
      context.importantMatterExplanation !== null &&
      context.importantMatterExplanation.completed === true &&
      context.importantMatterExplanation.acknowledgedByBuyer === true
    );
  },

  /**
   * Can move from 'contracting' to 'closing'
   * Requires: contract signed, 手付金 paid
   */
  canStartClosing: (context: JourneyContext): boolean => {
    return (
      context.contractSigned === true &&
      context.earnestMoneyPaid === true &&
      context.earnestMoneyAmount > 0
    );
  },

  /**
   * Can complete closing
   * Requires: final payment, ownership transfer registration filed,
   *           keys received
   */
  canCompletePurchase: (context: JourneyContext): boolean => {
    return (
      context.finalPaymentCompleted === true &&
      context.ownershipTransferFiled === true &&
      context.keysReceived === true
    );
  },
};
```

---

# Section 13: Notification & Communication System

## 13.1 Notification Architecture

```typescript
// services/notification/src/types.ts

export type NotificationChannel = 'in_app' | 'push' | 'email' | 'line';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationEvent {
  type: string;
  userId: string;
  data: Record<string, unknown>;
  priority: NotificationPriority;
  channels: NotificationChannel[];    // Which channels to deliver on
  scheduledFor?: Date;                // Null = immediate
  expiresAt?: Date;                   // Notification becomes irrelevant after this
  groupId?: string;                   // For notification batching
}

// All notification types in the system
export type NotificationType =
  // Property alerts
  | 'property.new_match'              // New property matches saved search
  | 'property.price_change'           // Saved property price changed
  | 'property.status_change'          // Saved property sold/under contract

  // Journey milestones
  | 'journey.viewing_reminder'        // Upcoming viewing reminder
  | 'journey.document_ready'          // Requested documents are available
  | 'journey.stage_advanced'          // Journey progressed to next stage
  | 'journey.action_required'         // User needs to take action
  | 'journey.deadline_approaching'    // Important deadline coming up

  // AI insights
  | 'ai.market_report'               // Weekly/monthly market report ready
  | 'ai.price_insight'               // Notable price movement in watched area

  // System
  | 'system.maintenance'             // Planned maintenance notification
  | 'system.feature_announcement';   // New feature available
```

## 13.2 Channel Router

```typescript
// services/notification/src/router.ts

/**
 * Routes notifications to appropriate channels based on:
 * 1. Notification type and priority
 * 2. User's channel preferences
 * 3. Time of day (quiet hours)
 * 4. Channel availability (fallback if LINE is down)
 */

const DEFAULT_ROUTING: Record<NotificationType, {
  channels: NotificationChannel[];
  priority: NotificationPriority;
  batchable: boolean;          // Can be grouped with similar notifications
  batchWindowMinutes?: number; // How long to wait before batching
}> = {
  'property.new_match': {
    channels: ['in_app', 'push', 'line'],
    priority: 'normal',
    batchable: true,
    batchWindowMinutes: 30,    // Batch new matches every 30 min
  },
  'property.price_change': {
    channels: ['in_app', 'push', 'line'],
    priority: 'high',
    batchable: false,          // Price changes are time-sensitive
  },
  'property.status_change': {
    channels: ['in_app', 'push', 'line'],
    priority: 'high',
    batchable: false,
  },
  'journey.viewing_reminder': {
    channels: ['in_app', 'push', 'line', 'email'],
    priority: 'high',
    batchable: false,
  },
  'journey.action_required': {
    channels: ['in_app', 'push', 'line', 'email'],
    priority: 'urgent',
    batchable: false,
  },
  'journey.deadline_approaching': {
    channels: ['in_app', 'push', 'line', 'email'],
    priority: 'urgent',
    batchable: false,
  },
  'ai.market_report': {
    channels: ['in_app', 'email'],
    priority: 'low',
    batchable: true,
    batchWindowMinutes: 1440,  // Daily digest
  },
  'ai.price_insight': {
    channels: ['in_app', 'line'],
    priority: 'normal',
    batchable: true,
    batchWindowMinutes: 60,
  },
  'system.maintenance': {
    channels: ['in_app', 'email'],
    priority: 'normal',
    batchable: false,
  },
  'system.feature_announcement': {
    channels: ['in_app'],
    priority: 'low',
    batchable: false,
  },
};

// Quiet hours: respect user's do-not-disturb settings
// Default: 22:00–07:00 JST
const DEFAULT_QUIET_HOURS = { start: 22, end: 7, timezone: 'Asia/Tokyo' };

export function routeNotification(
  event: NotificationEvent,
  userPreferences: UserNotificationPreferences
): RoutedNotification[] {
  const routing = DEFAULT_ROUTING[event.type as NotificationType];
  if (!routing) return [];

  const now = new Date();
  const jstHour = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Asia/Tokyo',
  }).format(now);
  const currentHour = parseInt(jstHour);

  const quietHours = userPreferences.quietHours ?? DEFAULT_QUIET_HOURS;
  const isQuietTime = quietHours.start > quietHours.end
    ? currentHour >= quietHours.start || currentHour < quietHours.end
    : currentHour >= quietHours.start && currentHour < quietHours.end;

  return routing.channels
    .filter(channel => {
      // Respect user opt-outs
      if (userPreferences.disabledChannels?.includes(channel)) return false;

      // During quiet hours, only urgent notifications go to push/LINE
      if (isQuietTime && routing.priority !== 'urgent') {
        return channel === 'in_app' || channel === 'email';
      }

      return true;
    })
    .map(channel => ({
      channel,
      event,
      priority: routing.priority,
      batchable: routing.batchable,
      batchWindowMinutes: routing.batchWindowMinutes,
    }));
}
```

## 13.3 LINE Integration

```typescript
// services/notification/src/channels/line.ts

import { messagingApi } from '@line/bot-sdk';

/**
 * LINE Messaging Integration
 *
 * For the portfolio project, this uses LINE's Messaging API
 * with a developer trial account (free, 500 messages/month).
 * The architecture supports production scaling.
 */

const lineClient = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

// LINE message templates — using Flex Messages for rich formatting
export const LINE_TEMPLATES = {
  'property.new_match': (data: {
    propertyTitle: string;
    price: string;
    layout: string;
    station: string;
    walkMinutes: number;
    imageUrl: string;
    detailUrl: string;
  }) => ({
    type: 'flex' as const,
    altText: `新着物件: ${data.propertyTitle}`,
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: data.imageUrl,
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🏠 条件に合う新着物件',
            weight: 'bold',
            size: 'xs',
            color: '#1DB446',
          },
          {
            type: 'text',
            text: data.propertyTitle,
            weight: 'bold',
            size: 'md',
            margin: 'md',
            wrap: true,
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '価格', color: '#aaaaaa', size: 'sm', flex: 2 },
                  { type: 'text', text: data.price, wrap: true, color: '#E8380D', size: 'sm', flex: 5, weight: 'bold' },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '間取り', color: '#aaaaaa', size: 'sm', flex: 2 },
                  { type: 'text', text: data.layout, size: 'sm', flex: 5 },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  { type: 'text', text: '最寄り', color: '#aaaaaa', size: 'sm', flex: 2 },
                  { type: 'text', text: `${data.station}駅 徒歩${data.walkMinutes}分`, size: 'sm', flex: 5 },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'uri',
              label: '詳細を見る',
              uri: data.detailUrl,
            },
          },
        ],
      },
    },
  }),

  'journey.viewing_reminder': (data: {
    propertyTitle: string;
    viewingDate: string;
    viewingTime: string;
    address: string;
  }) => ({
    type: 'flex' as const,
    altText: `内見リマインダー: ${data.viewingDate} ${data.viewingTime}`,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '📅 内見のお知らせ',
            weight: 'bold',
            size: 'md',
            color: '#1a73e8',
          },
          {
            type: 'text',
            text: data.propertyTitle,
            size: 'sm',
            margin: 'md',
            wrap: true,
          },
          {
            type: 'separator',
            margin: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: '📆', flex: 1 },
                  { type: 'text', text: `${data.viewingDate} ${data.viewingTime}`, flex: 6, size: 'sm' },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  { type: 'text', text: '📍', flex: 1 },
                  { type: 'text', text: data.address, flex: 6, size: 'sm', wrap: true },
                ],
              },
            ],
          },
        ],
      },
    },
  }),
};
```

---

# Section 14: Analytics & Product Intelligence

## 14.1 Event Taxonomy

```typescript
// packages/analytics/src/events.ts

/**
 * Structured analytics event definitions.
 *
 * Rules:
 * - Never include PII (personally identifiable information) in events
 * - Use entity IDs, not names or emails
 * - All events include: timestamp, sessionId, userId (hashed), platform
 */

export type AnalyticsEvent =
  // ─── Page / Screen Views ────────────────────────────────
  | { event: 'page.viewed'; properties: { path: string; referrer?: string; ward?: string } }
  | { event: 'screen.viewed'; properties: { screen: string; params?: Record<string, string> } }

  // ─── Search ─────────────────────────────────────────────
  | { event: 'search.executed'; properties: {
      query?: string;           // Search text (scrubbed of PII)
      filters: {
        ward?: string;
        priceMin?: number;
        priceMax?: number;
        layouts?: string[];
        walkMinutes?: number;
        earthquakeStandard?: string;
      };
      resultCount: number;
      responseTimeMs: number;
      isDegraded: boolean;      // Was this a fallback search?
    }}
  | { event: 'search.filter_changed'; properties: { filter: string; value: string } }
  | { event: 'search.sorted'; properties: { sortBy: string } }
  | { event: 'search.paginated'; properties: { page: number } }

  // ─── Property Interactions ──────────────────────────────
  | { event: 'property.viewed'; properties: {
      propertyId: string;
      ward: string;
      priceRange: string;      // Bucketed: '3000-5000', '5000-8000', etc.
      layout: string;
      source: 'search' | 'recommendation' | 'saved' | 'direct' | 'notification';
    }}
  | { event: 'property.saved'; properties: { propertyId: string; ward: string } }
  | { event: 'property.unsaved'; properties: { propertyId: string } }
  | { event: 'property.shared'; properties: { propertyId: string; method: 'link' | 'line' | 'email' } }
  | { event: 'property.image_viewed'; properties: { propertyId: string; imageIndex: number } }
  | { event: 'property.floorplan_viewed'; properties: { propertyId: string } }
  | { event: 'property.map_viewed'; properties: { propertyId: string } }

  // ─── AI Interactions ────────────────────────────────────
  | { event: 'ai.chat_started'; properties: { context: 'general' | 'property_specific'; triggerSource: string } }
  | { event: 'ai.message_sent'; properties: { messageLength: number; hasPropertyContext: boolean } }
  | { event: 'ai.response_received'; properties: {
      responseTimeMs: number;
      toolsUsed: string[];     // Which AI tools were invoked
      confidence?: number;
      isDegraded: boolean;
    }}
  | { event: 'ai.suggestion_clicked'; properties: { suggestionType: string; suggestionText: string } }
  | { event: 'ai.recommendation_clicked'; properties: {
      propertyId: string;
      recommendationType: 'similar' | 'price_match' | 'area_match' | 'lifestyle_match';
      position: number;        // Position in recommendation list
    }}
  | { event: 'ai.price_estimate_viewed'; properties: {
      propertyId: string;
      estimatedPrice: number;
      confidence: number;
      ward: string;
    }}
  | { event: 'ai.feedback'; properties: {
      messageId: string;
      rating: 'helpful' | 'not_helpful';
      feedbackType?: string;
    }}

  // ─── Journey Progression ───────────────────────────────
  | { event: 'journey.stage_entered'; properties: {
      stage: string;
      previousStage?: string;
      daysInPreviousStage?: number;
    }}
  | { event: 'journey.viewing_scheduled'; properties: { propertyId: string; ward: string } }
  | { event: 'journey.document_requested'; properties: { documentType: string; propertyId: string } }

  // ─── Engagement ────────────────────────────────────────
  | { event: 'notification.received'; properties: { type: string; channel: string } }
  | { event: 'notification.clicked'; properties: { type: string; channel: string } }
  | { event: 'session.started'; properties: { platform: 'web' | 'ios' | 'android'; isReturning: boolean } }
  | { event: 'session.ended'; properties: { durationSeconds: number; pagesViewed: number } };
```

## 14.2 Analytics Client

```typescript
// packages/analytics/src/client.ts

import posthog from 'posthog-js';
import type { AnalyticsEvent } from './events';

/**
 * Analytics client wrapper.
 *
 * Uses PostHog (self-hostable for Japanese data residency compliance).
 * In development, logs to console.
 * In production, sends to PostHog instance.
 */

interface AnalyticsConfig {
  posthogKey: string;
  posthogHost: string;        // Self-hosted instance URL
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

class Analytics {
  private initialized = false;
  private config: AnalyticsConfig | null = null;

  init(config: AnalyticsConfig) {
    this.config = config;

    if (config.environment === 'development') {
      this.initialized = true;
      return;
    }

    posthog.init(config.posthogKey, {
      api_host: config.posthogHost,
      autocapture: false,       // We use structured events only
      capture_pageview: false,  // We control page tracking
      persistence: 'localStorage',
      respect_dnt: true,        // Respect Do Not Track
      sanitize_properties: (properties) => {
        // Strip any accidentally included PII
        const sanitized = { ...properties };
        delete sanitized.email;
        delete sanitized.name;
        delete sanitized.phone;
        delete sanitized.address;
        return sanitized;
      },
    });

    this.initialized = true;
  }

  track<E extends AnalyticsEvent>(event: E['event'], properties: E['properties']) {
    if (!this.initialized) return;

    if (this.config?.environment === 'development') {
      console.log(`[Analytics] ${event}`, properties);
      return;
    }

    posthog.capture(event, properties);
  }

  identify(userId: string, traits?: Record<string, unknown>) {
    if (!this.initialized) return;

    // Hash the userId for privacy — PostHog never sees the real ID
    const hashedId = hashUserId(userId);

    if (this.config?.environment === 'development') {
      console.log(`[Analytics] Identify: ${hashedId}`, traits);
      return;
    }

    posthog.identify(hashedId, traits);
  }

  // Consent management — required for APPI compliance
  optIn() {
    posthog.opt_in_capturing();
  }

  optOut() {
    posthog.opt_out_capturing();
  }

  isOptedOut(): boolean {
    return posthog.has_opted_out_capturing();
  }
}

export const analytics = new Analytics();
```

## 14.3 AI Effectiveness Metrics

```typescript
// services/analytics/src/metrics/ai-effectiveness.ts

/**
 * Metrics for measuring AI feature effectiveness.
 * Computed as materialized views / scheduled queries.
 */

export const AI_METRICS = {
  /**
   * Recommendation Click-Through Rate
   * How often users click AI-recommended properties
   */
  recommendationCTR: {
    query: `
      SELECT
        recommendation_type,
        COUNT(CASE WHEN clicked THEN 1 END)::float / COUNT(*)::float as ctr,
        AVG(position) as avg_clicked_position,
        COUNT(*) as total_impressions
      FROM ai_recommendation_impressions
      WHERE timestamp > NOW() - INTERVAL '7 days'
      GROUP BY recommendation_type
    `,
    target: 0.15,  // 15% CTR target
    alertBelow: 0.05,
  },

  /**
   * Price Estimation Accuracy (Retroactive)
   * Compare our estimates to actual sale prices when properties sell
   */
  priceEstimationAccuracy: {
    query: `
      SELECT
        ward,
        AVG(ABS(estimated_price - actual_price)::float / actual_price::float) as mape,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ABS(estimated_price - actual_price)::float / actual_price::float) as median_error,
        COUNT(*) as comparisons
      FROM price_estimation_outcomes
      WHERE actual_sale_date > NOW() - INTERVAL '90 days'
      GROUP BY ward
    `,
    target: 0.10,  // 10% MAPE target
    alertAbove: 0.25,
  },

  /**
   * Chat Satisfaction Rate
   * Based on thumbs up/down feedback on AI messages
   */
  chatSatisfactionRate: {
    query: `
      SELECT
        DATE_TRUNC('day', timestamp) as day,
        COUNT(CASE WHEN rating = 'helpful' THEN 1 END)::float / NULLIF(COUNT(*), 0)::float as satisfaction_rate,
        COUNT(*) as total_ratings
      FROM ai_message_feedback
      WHERE timestamp > NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', timestamp)
      ORDER BY day
    `,
    target: 0.80,  // 80% satisfaction target
    alertBelow: 0.60,
  },

  /**
   * Conversation Completion Rate
   * How often AI chat sessions reach a productive conclusion
   * (user finds an answer, clicks a property, etc.)
   */
  conversationCompletionRate: {
    query: `
      SELECT
        context_type,
        COUNT(CASE WHEN outcome IN ('property_clicked', 'question_answered', 'action_taken') THEN 1 END)::float
          / COUNT(*)::float as completion_rate,
        AVG(message_count) as avg_messages_per_session,
        AVG(duration_seconds) as avg_session_duration
      FROM ai_chat_sessions
      WHERE started_at > NOW() - INTERVAL '7 days'
      GROUP BY context_type
    `,
    target: 0.65,
    alertBelow: 0.40,
  },
};
```

---

# Section 15: Legal & Compliance Framework

## 15.1 Compliance Requirements

```typescript
// packages/domain/src/compliance/requirements.ts

/**
 * Legal and compliance requirements for a Japanese real estate AI platform.
 *
 * This is the definitive checklist. Each requirement maps to a
 * technical implementation.
 */

export const COMPLIANCE_REQUIREMENTS = {
  /**
   * APPI — Act on the Protection of Personal Information
   * (個人情報の保護に関する法律)
   *
   * Japan's primary data protection law, amended 2022.
   */
  appi: {
    consentCollection: {
      requirement: 'Obtain explicit consent before collecting personal information',
      implementation: 'Consent banner on first visit, granular opt-in for each data purpose',
      status: 'required' as const,
    },
    purposeLimitation: {
      requirement: 'Use personal data only for stated purposes',
      implementation: 'Data purpose tags in schema, access controls per purpose',
      status: 'required' as const,
    },
    dataSubjectRights: {
      requirement: 'Allow users to access, correct, and delete their personal data',
      implementation: 'Settings page with data export (JSON), correction form, and account deletion',
      status: 'required' as const,
    },
    crossBorderTransfer: {
      requirement: 'Restrictions on transferring personal data outside Japan',
      implementation: 'All personal data stored in ap-northeast-1 (Tokyo). LLM API calls send only anonymized property data, never PII.',
      status: 'required' as const,
    },
    breachNotification: {
      requirement: 'Report data breaches to PPC and affected individuals',
      implementation: 'Incident response runbook, automated detection alerts',
      status: 'required' as const,
    },
  },

  /**
   * Real Estate Brokerage Act (宅地建物取引業法)
   *
   * Key question: Does our platform constitute real estate brokerage?
   */
  takkenGyohou: {
    aiValuationDisclaimer: {
      requirement: 'AI price estimates must not be presented as formal appraisals (不動産鑑定)',
      implementation: 'All price estimates include mandatory disclaimer. Never use the word "鑑定" or "鑑定評価".',
      status: 'required' as const,
    },
    licensedAgentRequirement: {
      requirement: 'If facilitating transactions, a 宅地建物取引業 license may be required',
      implementation: 'Platform is an information service only. Does not intermediate transactions. Clear ToS language.',
      status: 'required' as const,
    },
    importantMatterExplanation: {
      requirement: '重要事項説明 must be conducted by a licensed 宅地建物取引士',
      implementation: 'Journey stage tracks this as a required external step. Platform does not provide 重要事項説明 itself.',
      status: 'required' as const,
    },
  },

  /**
   * AI-specific disclaimers
   */
  aiDisclosures: {
    aiGeneratedContent: {
      requirement: 'Users must know when content is AI-generated',
      implementation: 'All AI responses tagged with "AI" indicator. Market reports labeled "AIが生成".',
      status: 'required' as const,
    },
    limitationOfLiability: {
      requirement: 'AI recommendations do not constitute professional advice',
      implementation: 'ToS + in-context disclaimers on all AI features',
      status: 'required' as const,
    },
  },
} as const;
```

## 15.2 Disclaimer Components

```typescript
// packages/ui/src/components/compliance/disclaimers.tsx

export function AIPriceDisclaimer() {
  return (
    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
      <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p>
        この価格推定はAIによる参考値であり、不動産鑑定評価ではありません。
        実際の取引価格は物件の状態、交渉、市場状況等により異なります。
        正確な評価については不動産の専門家にご相談ください。
      </p>
    </div>
  );
}

export function AIGeneratedBadge() {
  return (
    