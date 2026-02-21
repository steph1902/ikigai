export default function AdminConversationsPage() {
    const conversations = [
        { id: "conv_001", user: "田中太郎", channel: "web", messages: 24, lastMessage: "渋谷区でペット可の3LDKを探しています", category: "A", startedAt: "2026-02-20 14:30" },
        { id: "conv_002", user: "佐藤花子", channel: "line", messages: 12, lastMessage: "この物件の重要事項説明書を確認してください", category: "C", startedAt: "2026-02-20 10:15" },
        { id: "conv_003", user: "John Smith", channel: "web", messages: 8, lastMessage: "What is the typical buying process for foreigners?", category: "A", startedAt: "2026-02-19 16:45" },
        { id: "conv_004", user: "田中太郎", channel: "mobile", messages: 6, lastMessage: "内見の予約をお願いします", category: "B", startedAt: "2026-02-19 09:00" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Conversations</h2>
                <p className="text-muted-foreground">AI chat monitoring and mediation category tracking</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Category A (Info)</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">65%</div>
                    <div className="text-xs text-muted-foreground">Handled autonomously</div>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Category B (Logistics)</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">25%</div>
                    <div className="text-xs text-muted-foreground">User approval required</div>
                </div>
                <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Category C (Legal)</div>
                    <div className="text-2xl font-bold text-red-600 mt-1">10%</div>
                    <div className="text-xs text-muted-foreground">Escalated to 宅建士</div>
                </div>
            </div>

            <div className="rounded-lg border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">User</th>
                            <th className="px-4 py-3 text-left font-medium">Channel</th>
                            <th className="px-4 py-3 text-left font-medium">Messages</th>
                            <th className="px-4 py-3 text-left font-medium">Last Message</th>
                            <th className="px-4 py-3 text-left font-medium">Category</th>
                            <th className="px-4 py-3 text-left font-medium">Started</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conversations.map((conv) => (
                            <tr key={conv.id} className="border-b hover:bg-muted/25">
                                <td className="px-4 py-3 font-medium">{conv.user}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                                        {conv.channel}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{conv.messages}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[300px] truncate">{conv.lastMessage}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${conv.category === "A" ? "bg-green-100 text-green-800" :
                                            conv.category === "B" ? "bg-blue-100 text-blue-800" :
                                                "bg-red-100 text-red-800"
                                        }`}>
                                        {conv.category}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{conv.startedAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
