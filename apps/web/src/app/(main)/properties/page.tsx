export default function PropertiesPage() {
    const properties = [
        {
            id: "1",
            title: "渋谷区 恵比寿駅 3LDK マンション",
            price: "7,280万円",
            layout: "3LDK",
            area: "72.34㎡",
            station: "恵比寿駅",
            walk: "徒歩5分",
            age: "築8年",
            features: ["オートロック", "宅配ボックス", "南向き"],
        },
        {
            id: "2",
            title: "港区 麻布十番駅 2LDK マンション",
            price: "9,850万円",
            layout: "2LDK",
            area: "65.21㎡",
            station: "麻布十番駅",
            walk: "徒歩3分",
            age: "築3年",
            features: ["オートロック", "床暖房", "フロントサービス"],
        },
        {
            id: "3",
            title: "世田谷区 三軒茶屋駅 3LDK マンション",
            price: "6,450万円",
            layout: "3LDK",
            area: "78.50㎡",
            station: "三軒茶屋駅",
            walk: "徒歩7分",
            age: "築12年",
            features: ["ペット可", "追い焚き機能", "角部屋"],
        },
        {
            id: "4",
            title: "目黒区 中目黒駅 1LDK マンション",
            price: "5,180万円",
            layout: "1LDK",
            area: "42.10㎡",
            station: "中目黒駅",
            walk: "徒歩6分",
            age: "築5年",
            features: ["オートロック", "浴室乾燥機", "ウォークインクローゼット"],
        },
        {
            id: "5",
            title: "新宿区 神楽坂駅 2LDK マンション",
            price: "6,980万円",
            layout: "2LDK",
            area: "58.90㎡",
            station: "神楽坂駅",
            walk: "徒歩4分",
            age: "築15年",
            features: ["リノベーション済", "二重サッシ", "食器洗浄機"],
        },
        {
            id: "6",
            title: "文京区 茗荷谷駅 4LDK マンション",
            price: "8,200万円",
            layout: "4LDK",
            area: "95.00㎡",
            station: "茗荷谷駅",
            walk: "徒歩8分",
            age: "築2年",
            features: ["床暖房", "ディスポーザー", "24時間ゴミ出し可"],
        },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1A2E]">物件一覧</h1>
                    <p className="text-sm text-[#6B6B80] mt-1">
                        {properties.length}件の物件が見つかりました
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white">
                        <option>おすすめ順</option>
                        <option>価格が安い順</option>
                        <option>価格が高い順</option>
                        <option>新着順</option>
                        <option>面積が広い順</option>
                        <option>駅近い順</option>
                    </select>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <a
                        key={property.id}
                        href={`/property/${property.id}`}
                        className="group bg-white rounded-xl border border-[#E0E0E8] overflow-hidden hover:shadow-lg hover:border-[#3D5A80] transition-all"
                    >
                        {/* Image Placeholder */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-[#E8EEF4] to-[#F0F0F5] flex items-center justify-center">
                            <span className="text-4xl">🏠</span>
                        </div>

                        <div className="p-4">
                            <h3 className="font-medium text-[#1A1A2E] group-hover:text-[#3D5A80] transition-colors line-clamp-2">
                                {property.title}
                            </h3>

                            <p className="text-xl font-bold text-[#3D5A80] mt-2">
                                {property.price}
                            </p>

                            <div className="flex items-center gap-3 mt-3 text-sm text-[#6B6B80]">
                                <span>{property.layout}</span>
                                <span>|</span>
                                <span>{property.area}</span>
                                <span>|</span>
                                <span>{property.age}</span>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2 text-sm">
                                <span className="text-[#6B6B80]">{property.station}</span>
                                <span className="text-[#3D5A80] font-medium">
                                    {property.walk}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {property.features.slice(0, 3).map((feature) => (
                                    <span
                                        key={feature}
                                        className="text-xs px-2 py-0.5 rounded-full bg-[#F0F0F5] text-[#6B6B80]"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
