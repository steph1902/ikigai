/**
 * @ikigai/notifications — Notification Service
 *
 * Multi-channel notification delivery for:
 * - In-app notifications (web/mobile)
 * - Push notifications (Expo / FCM)
 * - LINE messages (via Messaging API)
 * - Email (via SES / SendGrid)
 *
 * Notification types:
 * - Journey stage updates (ステージ更新)
 * - Action approval requests (承認リクエスト)
 * - Viewing reminders (内見リマインダー)
 * - Document analysis results (書類分析結果)
 * - Price change alerts (価格変動通知)
 * - Professional escalation notices (宅建士エスカレーション)
 */

import { z } from "zod";
import { createServiceLogger } from "@ikigai/logger";

const log = createServiceLogger("notifications");

// ─── Types ───────────────────────────────────────────────────────────────────

export const notificationChannelSchema = z.enum([
    "in_app",
    "push",
    "line",
    "email",
]);
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;

export const notificationTypeSchema = z.enum([
    "journey_update",
    "action_approval",
    "viewing_reminder",
    "document_result",
    "price_alert",
    "escalation",
    "system",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: notificationTypeSchema,
    channel: notificationChannelSchema,
    titleJa: z.string(),
    titleEn: z.string(),
    bodyJa: z.string(),
    bodyEn: z.string(),
    data: z.record(z.unknown()).optional(),
    read: z.boolean().default(false),
    createdAt: z.date(),
});

export type Notification = z.infer<typeof notificationSchema>;

// ─── Notification Templates ──────────────────────────────────────────────────

/**
 * Pre-defined notification templates for common events.
 */
export const NOTIFICATION_TEMPLATES: Record<
    string,
    { type: NotificationType; titleJa: string; titleEn: string; bodyJa: string; bodyEn: string }
> = {
    VIEWING_SCHEDULED: {
        type: "viewing_reminder",
        titleJa: "内見予約完了",
        titleEn: "Viewing Scheduled",
        bodyJa: "内見の予約が確定しました。詳細をご確認ください。",
        bodyEn: "Your property viewing has been confirmed. Check details.",
    },
    VIEWING_REMINDER: {
        type: "viewing_reminder",
        titleJa: "内見リマインダー",
        titleEn: "Viewing Reminder",
        bodyJa: "明日の内見をお忘れなく。",
        bodyEn: "Don't forget your viewing tomorrow.",
    },
    PRICE_CHANGE: {
        type: "price_alert",
        titleJa: "価格変動通知",
        titleEn: "Price Change Alert",
        bodyJa: "お気に入り物件の価格が変更されました。",
        bodyEn: "A saved property's price has changed.",
    },
    DOCUMENT_ANALYZED: {
        type: "document_result",
        titleJa: "書類分析完了",
        titleEn: "Document Analysis Complete",
        bodyJa: "アップロードした書類の分析が完了しました。",
        bodyEn: "Your document analysis is ready for review.",
    },
    JOURNEY_ADVANCED: {
        type: "journey_update",
        titleJa: "ステージ更新",
        titleEn: "Journey Stage Updated",
        bodyJa: "購入ジャーニーのステージが更新されました。",
        bodyEn: "Your purchase journey stage has been updated.",
    },
    ESCALATION_REQUIRED: {
        type: "escalation",
        titleJa: "宅建士対応が必要です",
        titleEn: "Professional Review Required",
        bodyJa: "この件は宅地建物取引士の確認が必要です。担当者に連絡しました。",
        bodyEn: "This matter requires review by a licensed professional. We've notified your agent.",
    },
    ACTION_APPROVAL: {
        type: "action_approval",
        titleJa: "承認リクエスト",
        titleEn: "Approval Required",
        bodyJa: "AIが提案したアクションの承認をお願いします。",
        bodyEn: "Please approve an action proposed by the AI assistant.",
    },
};

// ─── Notification Service ────────────────────────────────────────────────────

/**
 * Create a notification from a template.
 */
export function createNotification(
    templateKey: keyof typeof NOTIFICATION_TEMPLATES,
    userId: string,
    channel: NotificationChannel = "in_app",
    data?: Record<string, unknown>,
): Notification {
    const template = NOTIFICATION_TEMPLATES[templateKey];
    if (!template) {
        throw new Error(`Unknown notification template: ${String(templateKey)}`);
    }

    const notification: Notification = {
        id: crypto.randomUUID(),
        userId,
        type: template.type,
        channel,
        titleJa: template.titleJa,
        titleEn: template.titleEn,
        bodyJa: template.bodyJa,
        bodyEn: template.bodyEn,
        data,
        read: false,
        createdAt: new Date(),
    };

    log.info(
        { notificationId: notification.id, type: notification.type, channel },
        `Notification created: ${String(templateKey)}`,
    );

    return notification;
}

/**
 * Determine the best channels to deliver a notification based on type.
 */
export function getDeliveryChannels(
    type: NotificationType,
    userPreferences: { push: boolean; email: boolean; line: boolean },
): NotificationChannel[] {
    const channels: NotificationChannel[] = ["in_app"]; // Always deliver in-app

    switch (type) {
        case "escalation":
            // Escalations are high-priority — deliver on all available channels
            if (userPreferences.push) channels.push("push");
            if (userPreferences.email) channels.push("email");
            if (userPreferences.line) channels.push("line");
            break;
        case "viewing_reminder":
            if (userPreferences.push) channels.push("push");
            if (userPreferences.line) channels.push("line");
            break;
        case "action_approval":
            if (userPreferences.push) channels.push("push");
            break;
        case "price_alert":
        case "document_result":
        case "journey_update":
            // Standard priority — in-app only unless user has push enabled
            if (userPreferences.push) channels.push("push");
            break;
    }

    return channels;
}
