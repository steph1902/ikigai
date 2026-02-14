import { faker } from '@faker-js/faker/locale/ja';
import { getPropertyImageUrl } from './images';

// Explicit interfaces to avoid "as const" inference hell
interface Station {
    name: string;
    lines: string[];
    lat: number;
    lng: number;
}

interface Area {
    ward: string;
    stations: Station[];
    pricePerSqm: { min: number; max: number };
    characteristics: string[];
}

// Real Tokyo ward/station data for geographic accuracy
export const TOKYO_AREAS: Area[] = [
    {
        ward: '渋谷区',
        stations: [
            { name: '渋谷', lines: ['JR山手線', '東急東横線', '銀座線', '半蔵門線', '副都心線'], lat: 35.6580, lng: 139.7016 },
            { name: '恵比寿', lines: ['JR山手線', '日比谷線'], lat: 35.6467, lng: 139.7100 },
            { name: '代官山', lines: ['東急東横線'], lat: 35.6488, lng: 139.7033 },
            { name: '表参道', lines: ['銀座線', '千代田線', '半蔵門線'], lat: 35.6653, lng: 139.7121 },
        ],
        pricePerSqm: { min: 800000, max: 2500000 },
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
];

const BUILDING_TYPES = [
    { type: 'mansion', label: 'マンション', floors: { min: 3, max: 47 }, units: { min: 20, max: 500 } },
    { type: 'mansion', label: '中古マンション', floors: { min: 3, max: 30 }, units: { min: 15, max: 300 } },
    { type: 'mansion', label: '新築マンション', floors: { min: 5, max: 47 }, units: { min: 30, max: 500 } },
    { type: 'kodate', label: '一戸建て', floors: { min: 2, max: 3 }, units: { min: 1, max: 1 } },
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
const NEW_EARTHQUAKE_STANDARD_DATE = new Date('1981-06-01');

// This interface matches the Drizzle insert schema as closely as possible
export interface DbProperty {
    source: "partner_direct";
    sourceListingId: string;
    address: string;
    prefecture: string;
    municipality: string;
    district: string;
    location: any; // Handled as raw SQL in insert
    lat: number;   // Helper for generating geometry
    lng: number;   // Helper for generating geometry
    buildingType: "mansion" | "apartment" | "kodate" | "land";
    structure: "rc" | "src" | "steel" | "wood" | "light_steel" | "other";
    totalAreaSqm: string; // Numeric is string in JS/Drizzle
    landAreaSqm: string;
    floorPlan: string;
    numRooms: number;
    floorLevel: number;
    totalFloors: number;
    totalUnits: number;
    yearBuilt: number;
    yearRenovated: number | null;
    earthquakeStandard: "new" | "old" | "unknown";
    listingPrice: number;
    managementFee: number;
    repairReserveFee: number;
    nearestStationName: string;
    nearestStationLine: string;
    nearestStationWalkMinutes: number;
    features: string[]; // JSON array
    images: string[];   // JSON array
    floorPlanImageUrl: string;
    description: string;
    listingDate: Date;
    status: 'active' | 'under_contract' | 'sold';
    isActive: boolean;
}

export function generateProperty(overrides?: Partial<DbProperty>): DbProperty {
    // Pick area weighted toward popular wards
    const area = faker.helpers.weightedArrayElement(
        TOKYO_AREAS.map((a, i) => ({
            value: a,
            weight: [15, 12, 18, 10, 14, 8, 11, 12][i],
        }))
    );

    const station = faker.helpers.arrayElement(area.stations);
    const buildingTypeObj = faker.helpers.arrayElement(BUILDING_TYPES);
    const layout = faker.helpers.arrayElement(LAYOUT_TYPES);

    const exclusiveArea = faker.number.float({
        min: layout.minSqm,
        max: layout.maxSqm,
        multipleOf: 0.01
    });

    const walkMinutes = faker.number.int({ min: 1, max: 15 });
    const walkDiscount = 1 - (walkMinutes - 1) * 0.015;

    const buildingAge = faker.number.int({ min: 0, max: 40 });
    const ageDiscount = 1 - buildingAge * 0.012;

    const basePricePerSqm = faker.number.int({
        min: area.pricePerSqm.min,
        max: area.pricePerSqm.max,
    });

    const adjustedPricePerSqm = Math.round(basePricePerSqm * walkDiscount * ageDiscount);
    const price = Math.round((adjustedPricePerSqm * exclusiveArea) / 10000) * 10000;

    const constructionDate = new Date();
    constructionDate.setFullYear(constructionDate.getFullYear() - buildingAge);
    constructionDate.setMonth(faker.number.int({ min: 0, max: 11 }));

    const totalFloors = faker.number.int({
        min: buildingTypeObj.floors.min,
        max: buildingTypeObj.floors.max,
    });

    const floor = faker.number.int({ min: 1, max: totalFloors });
    const floorPremium = 1 + (floor / totalFloors) * 0.05;
    const finalPrice = Math.round((price * floorPremium) / 10000) * 10000;

    // Derive structure
    let structure: "rc" | "src" | "steel" | "wood" | "light_steel" | "other" = "rc";
    if (totalFloors > 10) structure = faker.helpers.arrayElement(["rc", "src"] as const);
    else if (totalFloors > 3) structure = "rc";
    else structure = faker.helpers.arrayElement(["rc", "wood", "light_steel"] as const);

    const managementFee = Math.round(exclusiveArea * faker.number.int({ min: 150, max: 350 }));
    const repairReserveFund = Math.round(exclusiveArea * faker.number.int({ min: 100, max: 300 }));

    const chome = faker.number.int({ min: 1, max: 5 });
    const ban = faker.number.int({ min: 1, max: 30 });
    const go = faker.number.int({ min: 1, max: 20 });
    const address = `東京都${area.ward}${station.name}${chome}丁目${ban}番${go}号`;

    const lat = station.lat + (faker.number.float({ min: -0.008, max: 0.008 }));
    const lng = station.lng + (faker.number.float({ min: -0.008, max: 0.008 }));

    const features = generateFeatures(buildingAge, totalFloors, floor, area.characteristics);
    const id = `prop_${faker.string.nanoid(12)}`;

    // Generate Image URLs
    const imageUrls = Array.from(
        { length: faker.number.int({ min: 5, max: 12 }) },
        (_, i) => getPropertyImageUrl(id, i, i === 0 ? 'exterior' : i === 1 ? 'floorplan' : i === 2 ? 'view' : 'interior')
    );

    return {
        source: "partner_direct",
        sourceListingId: id,
        address,
        prefecture: "Tokyo",
        municipality: area.ward,
        district: `${station.name}${chome}丁目`,
        location: null, // Placeholder, formatted in insert
        lat,
        lng,
        buildingType: buildingTypeObj.type as any,
        structure,
        totalAreaSqm: exclusiveArea.toFixed(2),
        landAreaSqm: (exclusiveArea * 0.8).toFixed(2), // Rough estimate for ownership share or land
        floorPlan: layout.layout,
        numRooms: layout.rooms,
        floorLevel: floor,
        totalFloors,
        totalUnits: faker.number.int({ min: buildingTypeObj.units.min, max: buildingTypeObj.units.max }),
        yearBuilt: constructionDate.getFullYear(),
        yearRenovated: features.includes("リノベーション済") ? new Date().getFullYear() - 1 : null,
        earthquakeStandard: constructionDate >= NEW_EARTHQUAKE_STANDARD_DATE ? "new" : "old",
        listingPrice: finalPrice,
        managementFee,
        repairReserveFee: repairReserveFund,
        nearestStationName: station.name,
        nearestStationLine: station.lines.join("・"),
        nearestStationWalkMinutes: walkMinutes,
        features,
        images: imageUrls.filter(url => !url.includes('floorplan')), // Separate floorplan
        floorPlanImageUrl: imageUrls.find(url => url.includes('floorplan')) || getPropertyImageUrl(id, 0, 'floorplan'),
        description: generateDescription(area, station, layout, buildingAge, features),
        listingDate: faker.date.recent({ days: 90 }),
        status: faker.helpers.weightedArrayElement([
            { value: 'active' as const, weight: 75 },
            { value: 'under_contract' as const, weight: 15 },
            { value: 'sold' as const, weight: 10 },
        ]),
        isActive: true,
        ...overrides,
    };
}

function generateFeatures(
    buildingAge: number,
    totalFloors: number,
    floor: number,
    areaCharacteristics: string[]
): string[] {
    const features: string[] = [];
    const possibleFeatures = [
        { name: 'オートロック', prob: buildingAge < 20 ? 0.9 : 0.5 },
        { name: '宅配ボックス', prob: buildingAge < 15 ? 0.8 : 0.3 },
        { name: '浴室乾燥機', prob: 0.7 },
        { name: '追い焚き機能', prob: 0.6 },
        { name: 'ウォシュレット', prob: 0.8 },
        { name: '床暖房', prob: buildingAge < 10 ? 0.5 : 0.15 },
        { name: 'ペット可', prob: 0.3 },
        { name: '24時間ゴミ出し可', prob: buildingAge < 20 ? 0.6 : 0.2 },
        { name: '角部屋', prob: 0.25 },
        { name: '南向き', prob: 0.35 },
        { name: 'リノベーション済', prob: buildingAge > 15 ? 0.3 : 0 },
        { name: '二重サッシ', prob: 0.3 },
    ];

    for (const feature of possibleFeatures) {
        if (Math.random() < feature.prob) {
            features.push(feature.name);
        }
    }

    // Boost features based on characteristics
    if (areaCharacteristics.includes('luxury') && Math.random() < 0.5) features.push('コンシェルジュ');
    if (areaCharacteristics.includes('family-friendly') && Math.random() < 0.5) features.push('キッズルーム');

    return features;
}

function generateDescription(
    area: Area,
    station: Station,
    layout: (typeof LAYOUT_TYPES)[number],
    buildingAge: number,
    features: string[]
): string {
    const lines = station.lines.join('・');
    const walkDesc = `${station.name}駅（${lines}）`;
    let desc = `${area.ward}の${walkDesc}から徒歩圏内の物件です。`;

    if (buildingAge === 0) desc += '新築物件として、最新の設備と耐震基準を備えています。';
    else desc += `築${buildingAge}年の物件です。`;

    if (features.includes('リノベーション済')) desc += 'リノベーション済みで、室内は新築同様の状態です。';
    if (area.characteristics.includes('family-friendly')) desc += '周辺には公園や学校が多く、子育て環境に適しています。';
    if (area.characteristics.includes('luxury')) desc += '高級感のあるエントランスが魅力です。';

    return desc;
}

export function generateDataset(count: number = 500): DbProperty[] {
    return Array.from({ length: count }, () => generateProperty());
}

export function generatePriceHistory(ward: string, months: number = 60) {
    // Same implementation as before...
    const area = TOKYO_AREAS.find(a => a.ward === ward) ?? TOKYO_AREAS[0];
    const basePrice = (area.pricePerSqm.min + area.pricePerSqm.max) / 2;
    const history: Array<{ date: string; avgPricePerSqm: number; transactions: number }> = [];
    let currentPrice = basePrice * 0.85;

    for (let i = months; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const seasonalFactor = 1 + 0.02 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
        const trendFactor = 1 + 0.003;
        const noise = 1 + (Math.random() - 0.5) * 0.02;
        currentPrice = currentPrice * trendFactor * seasonalFactor * noise;
        const baseTransactions = faker.number.int({ min: 30, max: 80 });
        const seasonalTransactions = date.getMonth() === 2 ? 1.5 : date.getMonth() === 8 ? 1.3 : 1;

        history.push({
            date: date.toISOString().slice(0, 7),
            avgPricePerSqm: Math.round(currentPrice),
            transactions: Math.round(baseTransactions * seasonalTransactions),
        });
    }
    return history;
}
