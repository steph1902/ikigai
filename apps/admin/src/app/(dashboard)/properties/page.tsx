export default function AdminPropertiesPage() {
  const properties = [
    { id: "prop_001", address: "渋谷区恵比寿1-2-3", layout: "3LDK", price: "7,280万円", status: "active", source: "seed", lastUpdated: "2026-02-20" },
    { id: "prop_002", address: "港区麻布十番3-5-8", layout: "2LDK", price: "9,850万円", status: "active", source: "seed", lastUpdated: "2026-02-20" },
    { id: "prop_003", address: "世田谷区三軒茶屋2-10-1", layout: "3LDK", price: "6,450万円", status: "under_contract", source: "seed", lastUpdated: "2026-02-19" },
    { id: "prop_004", address: "目黒区中目黒4-7-12", layout: "1LDK", price: "5,180万円", status: "active", source: "seed", lastUpdated: "2026-02-18" },
    { id: "prop_005", address: "新宿区神楽坂5-3-2", layout: "2LDK", price: "6,980万円", status: "sold", source: "seed", lastUpdated: "2026-02-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">Manage property listings</p>
        </div>
        <span className="text-sm text-muted-foreground">{properties.length} total</span>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Address</th>
              <th className="px-4 py-3 text-left font-medium">Layout</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Source</th>
              <th className="px-4 py-3 text-left font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b hover:bg-muted/25">
                <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                <td className="px-4 py-3">{p.address}</td>
                <td className="px-4 py-3">{p.layout}</td>
                <td className="px-4 py-3 font-medium">{p.price}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-800" :
                      p.status === "under_contract" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                    {p.status === "active" ? "販売中" : p.status === "under_contract" ? "契約中" : "成約"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{p.source}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{p.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
