export default function AdminUsersPage() {
  const users = [
    { id: "usr_001", name: "田中太郎", email: "tanaka@example.com", role: "buyer", stage: "evaluating", locale: "ja", createdAt: "2026-01-15" },
    { id: "usr_002", name: "佐藤花子", email: "sato@example.com", role: "buyer", stage: "searching", locale: "ja", createdAt: "2026-01-20" },
    { id: "usr_003", name: "John Smith", email: "john@example.com", role: "buyer", stage: "exploring", locale: "en", createdAt: "2026-02-01" },
    { id: "usr_004", name: "鈴木一郎", email: "suzuki@example.com", role: "partner_agent", stage: "—", locale: "ja", createdAt: "2025-12-10" },
    { id: "usr_005", name: "Admin", email: "admin@ikigai.jp", role: "admin", stage: "—", locale: "ja", createdAt: "2025-11-01" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">User management and journey tracking</p>
        </div>
        <span className="text-sm text-muted-foreground">{users.length} total</span>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Journey Stage</th>
              <th className="px-4 py-3 text-left font-medium">Locale</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-muted/25">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-800" :
                      u.role === "partner_agent" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{u.stage}</td>
                <td className="px-4 py-3 text-xs">{u.locale.toUpperCase()}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
