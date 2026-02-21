/**
 * Partner Agent Dashboard — Main Page
 *
 * Shows the agent's active client portfolio, pending viewings,
 * escalated conversations (Category C), and transaction pipeline.
 *
 * This is the primary interface for licensed 宅建士 (real estate professionals)
 * who handle escalated actions from the AI system.
 */

export default function AgentDashboardPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <header className="bg-white border-b border-[#E0E0E8] px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-[#1A1A2E]">
                            生き甲斐 <span className="text-sm font-normal text-[#6B6B80]">パートナーエージェント</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#6B6B80]">鈴木一郎（宅建士）</span>
                        <div className="w-8 h-8 rounded-full bg-[#3D5A80] text-white flex items-center justify-center text-sm font-medium">
                            鈴
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "担当クライアント", value: "12", icon: "👤", trend: "+2 今月" },
                        { label: "エスカレーション待ち", value: "3", icon: "🔴", trend: "対応要" },
                        { label: "今週の内見", value: "5", icon: "🏠", trend: "2件明日" },
                        { label: "進行中取引", value: "4", icon: "📋", trend: "1件契約準備中" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl border border-[#E0E0E8] p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className="text-sm text-[#6B6B80]">{stat.label}</span>
                            </div>
                            <div className="text-3xl font-bold text-[#1A1A2E]">{stat.value}</div>
                            <div className="text-xs text-[#6B6B80] mt-1">{stat.trend}</div>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Escalations */}
                    <div className="bg-white rounded-xl border border-[#E0E0E8] p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            エスカレーション対応
                        </h2>
                        <div className="space-y-3">
                            {[
                                { client: "田中太郎", topic: "恵比寿物件の価格交渉について", category: "C", time: "30分前", urgent: true },
                                { client: "佐藤花子", topic: "重要事項説明書の条項確認", category: "C", time: "2時間前", urgent: true },
                                { client: "John Smith", topic: "外国人の住宅ローン審査について", category: "C", time: "昨日", urgent: false },
                            ].map((item) => (
                                <div
                                    key={item.client + item.topic}
                                    className={`p-4 rounded-lg border cursor-pointer hover:border-[#3D5A80] transition-colors ${item.urgent ? "border-red-200 bg-red-50/30" : "border-[#E0E0E8]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-[#1A1A2E]">{item.client}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                                                カテゴリ{item.category}
                                            </span>
                                            <span className="text-xs text-[#6B6B80]">{item.time}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#6B6B80]">{item.topic}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Viewings */}
                    <div className="bg-white rounded-xl border border-[#E0E0E8] p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                            📅 今週の内見スケジュール
                        </h2>
                        <div className="space-y-3">
                            {[
                                { date: "2/22 (土)", time: "10:00", client: "田中太郎", property: "渋谷区恵比寿 3LDK", status: "confirmed" },
                                { date: "2/22 (土)", time: "14:00", client: "佐藤花子", property: "目黒区中目黒 2LDK", status: "confirmed" },
                                { date: "2/23 (日)", time: "11:00", client: "田中太郎", property: "世田谷区三軒茶屋 3LDK", status: "pending" },
                                { date: "2/24 (月)", time: "15:00", client: "John Smith", property: "新宿区神楽坂 2LDK", status: "confirmed" },
                                { date: "2/25 (火)", time: "10:00", client: "山田花子", property: "文京区茗荷谷 4LDK", status: "pending" },
                            ].map((viewing) => (
                                <div key={`${viewing.date}-${viewing.time}`} className="flex items-center gap-4 p-3 rounded-lg bg-[#F4F7FA]">
                                    <div className="text-center min-w-[60px]">
                                        <div className="text-xs text-[#6B6B80]">{viewing.date}</div>
                                        <div className="text-sm font-bold text-[#3D5A80]">{viewing.time}</div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#1A1A2E]">{viewing.property}</p>
                                        <p className="text-xs text-[#6B6B80]">{viewing.client}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${viewing.status === "confirmed"
                                            ? "bg-[#E6F4ED] text-[#2E7D5B]"
                                            : "bg-[#FFF8E1] text-[#B8860B]"
                                        }`}>
                                        {viewing.status === "confirmed" ? "確定" : "仮予約"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Transactions */}
                <div className="bg-white rounded-xl border border-[#E0E0E8] p-6 mt-8">
                    <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                        📋 進行中取引
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#E0E0E8]">
                                    <th className="px-4 py-3 text-left font-medium text-[#6B6B80]">クライアント</th>
                                    <th className="px-4 py-3 text-left font-medium text-[#6B6B80]">物件</th>
                                    <th className="px-4 py-3 text-left font-medium text-[#6B6B80]">価格</th>
                                    <th className="px-4 py-3 text-left font-medium text-[#6B6B80]">ステージ</th>
                                    <th className="px-4 py-3 text-left font-medium text-[#6B6B80]">次のアクション</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { client: "田中太郎", property: "恵比寿 3LDK", price: "7,280万円", stage: "交渉中", action: "売主回答待ち" },
                                    { client: "佐藤花子", property: "中目黒 2LDK", price: "5,980万円", stage: "検討中", action: "内見後フォロー" },
                                    { client: "鈴木次郎", property: "三軒茶屋 3LDK", price: "6,450万円", stage: "契約準備", action: "重説作成" },
                                    { client: "高橋美咲", property: "代々木 1LDK", price: "4,200万円", stage: "引渡準備", action: "残金決済 3/15" },
                                ].map((tx) => (
                                    <tr key={tx.client + tx.property} className="border-b border-[#E0E0E8] hover:bg-[#F4F7FA]">
                                        <td className="px-4 py-3 font-medium text-[#1A1A2E]">{tx.client}</td>
                                        <td className="px-4 py-3">{tx.property}</td>
                                        <td className="px-4 py-3 font-medium text-[#3D5A80]">{tx.price}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8EEF4] text-[#3D5A80]">
                                                {tx.stage}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[#6B6B80]">{tx.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
