export default function JourneyPage() {
    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">
                購入ジャーニー
            </h1>

            {/* Journey Progress */}
            <div className="bg-white rounded-xl border border-[#E0E0E8] p-6 mb-8">
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                    現在のステータス
                </h2>
                <div className="flex items-center justify-between mb-6">
                    {[
                        { label: "情報収集", active: true, done: true },
                        { label: "物件検索", active: true, done: true },
                        { label: "物件検討", active: true, done: false },
                        { label: "交渉", active: false, done: false },
                        { label: "契約", active: false, done: false },
                        { label: "引渡", active: false, done: false },
                    ].map((stage, i) => (
                        <div key={stage.label} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${stage.done
                                            ? "bg-[#2E7D5B] text-white"
                                            : stage.active
                                                ? "bg-[#3D5A80] text-white ring-2 ring-[#3D5A80] ring-offset-2"
                                                : "bg-[#F0F0F5] text-[#6B6B80]"
                                        }`}
                                >
                                    {stage.done ? "✓" : i + 1}
                                </div>
                                <span
                                    className={`mt-2 text-xs ${stage.active ? "font-semibold text-[#1A1A2E]" : "text-[#6B6B80]"}`}
                                >
                                    {stage.label}
                                </span>
                            </div>
                            {i < 5 && (
                                <div
                                    className={`h-0.5 flex-1 ${stage.done ? "bg-[#3D5A80]" : "bg-[#E0E0E8]"}`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Shortlisted Properties */}
            <div className="bg-white rounded-xl border border-[#E0E0E8] p-6 mb-8">
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                    お気に入り物件
                </h2>
                <div className="space-y-4">
                    {[
                        {
                            title: "渋谷区 恵比寿駅 3LDK マンション",
                            price: "7,280万円",
                            status: "内見予約済",
                            statusColor: "bg-[#E8EEF4] text-[#3D5A80]",
                        },
                        {
                            title: "目黒区 中目黒駅 2LDK マンション",
                            price: "5,980万円",
                            status: "検討中",
                            statusColor: "bg-[#FFF8E1] text-[#B8860B]",
                        },
                        {
                            title: "世田谷区 三軒茶屋駅 3LDK マンション",
                            price: "6,450万円",
                            status: "検討中",
                            statusColor: "bg-[#FFF8E1] text-[#B8860B]",
                        },
                    ].map((property) => (
                        <div
                            key={property.title}
                            className="flex items-center justify-between p-4 rounded-lg border border-[#E0E0E8] hover:border-[#3D5A80] transition-colors cursor-pointer"
                        >
                            <div>
                                <h3 className="font-medium text-[#1A1A2E]">
                                    {property.title}
                                </h3>
                                <p className="text-lg font-bold text-[#3D5A80] mt-1">
                                    {property.price}
                                </p>
                            </div>
                            <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${property.statusColor}`}
                            >
                                {property.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl border border-[#E0E0E8] p-6">
                <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
                    今後のスケジュール
                </h2>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-[#F4F7FA]">
                        <div className="text-center">
                            <div className="text-xs text-[#6B6B80]">2月</div>
                            <div className="text-xl font-bold text-[#3D5A80]">23</div>
                        </div>
                        <div>
                            <p className="font-medium text-[#1A1A2E]">内見：恵比寿物件</p>
                            <p className="text-sm text-[#6B6B80]">14:00 〜 15:00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-[#F4F7FA]">
                        <div className="text-center">
                            <div className="text-xs text-[#6B6B80]">2月</div>
                            <div className="text-xl font-bold text-[#3D5A80]">28</div>
                        </div>
                        <div>
                            <p className="font-medium text-[#1A1A2E]">
                                住宅ローン事前審査 回答期限
                            </p>
                            <p className="text-sm text-[#6B6B80]">書類提出済み</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
