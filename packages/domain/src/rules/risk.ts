/**
 * Property Risk Assessment Module.
 *
 * Evaluates risk factors for Japanese real estate properties based on:
 * - Earthquake standard (耐震基準)
 * - Building age
 * - Hazard zone status
 * - Structural type
 */

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskFactor {
    id: string;
    category: "seismic" | "structural" | "environmental" | "legal";
    level: RiskLevel;
    label: string;
    labelJa: string;
    description: string;
    descriptionJa: string;
}

export interface RiskAssessment {
    overallLevel: RiskLevel;
    score: number; // 0-100, lower is riskier
    factors: RiskFactor[];
    summary: string;
    summaryJa: string;
}

interface PropertyForRisk {
    earthquakeStandard?: "old" | "new" | "grade1" | "grade2" | "grade3" | "unknown" | null;
    yearBuilt?: number | null;
    structure?: "rc" | "src" | "steel" | "wood" | "light_steel" | "other" | null;
    psychologicalDefect?: string | null;
    designatedZone?: boolean | null;
}

const CURRENT_YEAR = new Date().getFullYear();

export function assessPropertyRisk(property: PropertyForRisk): RiskAssessment {
    const factors: RiskFactor[] = [];
    let score = 100;

    // --- Seismic risk ---
    const yearBuilt = property.yearBuilt;
    const standard = property.earthquakeStandard;

    if (standard === "old" || (yearBuilt != null && yearBuilt < 1981)) {
        factors.push({
            id: "seismic-old",
            category: "seismic",
            level: "high",
            label: "Pre-1981 earthquake standard",
            labelJa: "旧耐震基準（1981年以前）",
            description: "Built before the 1981 Building Standards Act revision. May not withstand a major earthquake without reinforcement.",
            descriptionJa: "1981年の建築基準法改正前の旧耐震基準で建設されています。大規模地震に耐えられない可能性があります。",
        });
        score -= 30;
    } else if (standard === "new" || standard === "grade1") {
        factors.push({
            id: "seismic-new",
            category: "seismic",
            level: "low",
            label: "New earthquake standard",
            labelJa: "新耐震基準",
            description: "Built to the post-1981 seismic standard.",
            descriptionJa: "1981年以降の新耐震基準に適合しています。",
        });
    } else if (standard === "grade2" || standard === "grade3") {
        factors.push({
            id: "seismic-grade-high",
            category: "seismic",
            level: "low",
            label: `Earthquake resistance grade ${standard.replace("grade", "")}`,
            labelJa: `耐震等級${standard.replace("grade", "")}`,
            description: "Enhanced earthquake resistance beyond building code requirements.",
            descriptionJa: "建築基準法を超える高い耐震性能を有しています。",
        });
        score += 5;
    } else if (standard === "unknown") {
        factors.push({
            id: "seismic-unknown",
            category: "seismic",
            level: "medium",
            label: "Unknown earthquake standard",
            labelJa: "耐震基準不明",
            description: "Earthquake resistance standard is not confirmed. Inspection recommended.",
            descriptionJa: "耐震基準が確認できていません。耐震診断をお勧めします。",
        });
        score -= 15;
    }

    // --- Structural age risk ---
    if (yearBuilt != null) {
        const age = CURRENT_YEAR - yearBuilt;
        if (age > 40) {
            factors.push({
                id: "age-very-old",
                category: "structural",
                level: "high",
                label: `Building is ${age} years old`,
                labelJa: `築${age}年`,
                description: "Building is over 40 years old. Major renovation may be required.",
                descriptionJa: "築40年以上です。大規模修繕が必要な可能性があります。",
            });
            score -= 20;
        } else if (age > 25) {
            factors.push({
                id: "age-old",
                category: "structural",
                level: "medium",
                label: `Building is ${age} years old`,
                labelJa: `築${age}年`,
                description: "Building is over 25 years old. Check repair history.",
                descriptionJa: "築25年以上です。修繕履歴をご確認ください。",
            });
            score -= 10;
        }
    }

    // --- Wood structure risk ---
    if (property.structure === "wood") {
        factors.push({
            id: "structure-wood",
            category: "structural",
            level: "medium",
            label: "Wooden structure",
            labelJa: "木造",
            description: "Wooden buildings have shorter lifespan and higher fire risk. Check for termite treatment.",
            descriptionJa: "木造建築は耐用年数が短く、防火性能が低い傾向があります。シロアリ対策をご確認ください。",
        });
        score -= 10;
    }

    // --- Psychological defect ---
    if (property.psychologicalDefect) {
        factors.push({
            id: "psychological-defect",
            category: "legal",
            level: "critical",
            label: "Psychological defect (事故物件)",
            labelJa: "心理的瑕疵あり",
            description: "This property has a psychological defect that must be disclosed.",
            descriptionJa: "この物件には告知事項（心理的瑕疵）があります。重要事項説明で詳細を確認してください。",
        });
        score -= 25;
    }

    // --- Designated zone ---
    if (property.designatedZone) {
        factors.push({
            id: "designated-zone",
            category: "environmental",
            level: "medium",
            label: "Within designated hazard zone",
            labelJa: "災害警戒区域内",
            description: "Located in a designated hazard zone. Additional due diligence recommended.",
            descriptionJa: "災害警戒区域内に位置しています。追加の調査をお勧めします。",
        });
        score -= 15;
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    const overallLevel = getOverallLevel(score, factors);
    const { summary, summaryJa } = generateSummary(overallLevel, factors);

    return { overallLevel, score, factors, summary, summaryJa };
}

function getOverallLevel(score: number, factors: RiskFactor[]): RiskLevel {
    if (factors.some((f) => f.level === "critical")) return "critical";
    if (score >= 80) return "low";
    if (score >= 50) return "medium";
    return "high";
}

function generateSummary(
    level: RiskLevel,
    factors: RiskFactor[],
): { summary: string; summaryJa: string } {
    const count = factors.length;
    switch (level) {
        case "low":
            return {
                summary: `Low risk. ${count} factor(s) evaluated — no significant concerns identified.`,
                summaryJa: `リスク低。${count}件の項目を評価し、重大な問題は確認されませんでした。`,
            };
        case "medium":
            return {
                summary: `Moderate risk. ${count} factor(s) identified that warrant attention.`,
                summaryJa: `リスク中。注意が必要な項目が${count}件確認されました。`,
            };
        case "high":
            return {
                summary: `High risk. ${count} factor(s) identified — professional inspection recommended.`,
                summaryJa: `リスク高。${count}件の項目が確認されました。専門家による診断をお勧めします。`,
            };
        case "critical":
            return {
                summary: `Critical risk. Significant issues identified — exercise extreme caution.`,
                summaryJa: `リスク重大。重大な問題が確認されました。十分にご注意ください。`,
            };
    }
}
