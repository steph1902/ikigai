import { Card, CardContent, CardHeader, CardTitle } from "@ikigai/ui/components/card";
import { Activity, Building2, DollarSign, Users } from "lucide-react";

const STATS = [
  { label: "Total Properties", value: "324", icon: Building2, trend: "+12%" },
  { label: "Active Users", value: "1,205", icon: Users, trend: "+5%" },
  { label: "Avg. Price", value: "¥45M", icon: DollarSign, trend: "-2%" },
  { label: "System Health", value: "98%", icon: Activity, trend: "Stable" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of Ikigai Real Estate Platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
