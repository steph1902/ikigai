/**
 * LINE Flex Message templates for IKIGAI.
 * Flex Messages are LINE's rich card format — used for property cards,
 * price predictions, and action approval requests.
 *
 * @see https://developers.line.biz/en/docs/messaging-api/flex-message-elements/
 */

interface PropertyData {
    title: string;
    price: string;
    layout: string;
    area: string;
    station: string;
    walkMinutes: number;
    age: string;
    imageUrl?: string;
    detailUrl: string;
}

/**
 * Generate a Flex Message for a property card in LINE chat.
 * Shows property image, details, and action buttons.
 */
export function createPropertyFlexMessage(property: PropertyData) {
    return {
        type: "flex" as const,
        altText: `${property.title} - ${property.price}`,
        contents: {
            type: "bubble",
            size: "mega",
            hero: {
                type: "image",
                url: property.imageUrl ?? "https://via.placeholder.com/800x600/E8EEF4/3D5A80?text=Property",
                size: "full",
                aspectRatio: "4:3",
                aspectMode: "cover",
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: property.title,
                        weight: "bold",
                        size: "md",
                        wrap: true,
                    },
                    {
                        type: "text",
                        text: property.price,
                        weight: "bold",
                        size: "xl",
                        color: "#3D5A80",
                        margin: "md",
                    },
                    {
                        type: "separator",
                        margin: "lg",
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                            createDetailRow("間取り", property.layout),
                            createDetailRow("面積", property.area),
                            createDetailRow("最寄駅", `${property.station} 徒歩${property.walkMinutes}分`),
                            createDetailRow("築年数", property.age),
                        ],
                    },
                ],
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "primary",
                        color: "#3D5A80",
                        action: {
                            type: "uri",
                            label: "詳しく見る",
                            uri: property.detailUrl,
                        },
                    },
                    {
                        type: "button",
                        style: "secondary",
                        action: {
                            type: "message",
                            label: "AIに相談する",
                            text: `${property.title}について詳しく教えてください`,
                        },
                    },
                ],
            },
        },
    };
}

function createDetailRow(label: string, value: string) {
    return {
        type: "box" as const,
        layout: "horizontal" as const,
        contents: [
            {
                type: "text" as const,
                text: label,
                size: "sm" as const,
                color: "#6B6B80",
                flex: 2,
            },
            {
                type: "text" as const,
                text: value,
                size: "sm" as const,
                color: "#1A1A2E",
                flex: 3,
                weight: "bold" as const,
            },
        ],
    };
}

/**
 * Generate a Flex Message for an action approval request.
 * Used when the AI needs user confirmation (Category B actions).
 */
export function createApprovalFlexMessage(data: {
    action: string;
    description: string;
    details: string;
}) {
    return {
        type: "flex" as const,
        altText: `承認リクエスト: ${data.action}`,
        contents: {
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "🤖 承認リクエスト",
                        weight: "bold",
                        size: "md",
                        color: "#7C6DAF",
                    },
                    {
                        type: "text",
                        text: data.action,
                        weight: "bold",
                        size: "lg",
                        margin: "md",
                    },
                    {
                        type: "text",
                        text: data.description,
                        size: "sm",
                        color: "#6B6B80",
                        margin: "md",
                        wrap: true,
                    },
                    {
                        type: "separator",
                        margin: "lg",
                    },
                    {
                        type: "text",
                        text: data.details,
                        size: "xs",
                        color: "#6B6B80",
                        margin: "lg",
                        wrap: true,
                    },
                ],
            },
            footer: {
                type: "box",
                layout: "horizontal",
                spacing: "md",
                contents: [
                    {
                        type: "button",
                        style: "primary",
                        color: "#2E7D5B",
                        action: {
                            type: "message",
                            label: "承認する",
                            text: `承認: ${data.action}`,
                        },
                    },
                    {
                        type: "button",
                        style: "secondary",
                        action: {
                            type: "message",
                            label: "拒否する",
                            text: `拒否: ${data.action}`,
                        },
                    },
                ],
            },
        },
    };
}
