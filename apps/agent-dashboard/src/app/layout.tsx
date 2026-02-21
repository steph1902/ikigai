import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "IKIGAI Partner Agent Dashboard",
    description: "Real estate agent portal for managing clients, viewings, and transactions",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body className="antialiased">{children}</body>
        </html>
    );
}
