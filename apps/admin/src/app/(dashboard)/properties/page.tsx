import { db } from "@ikigai/db";
import { properties } from "@ikigai/db/schema/properties";
import { Badge } from "@ikigai/ui/components/badge";
import { Button } from "@ikigai/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ikigai/ui/components/table";
import { desc } from "drizzle-orm";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function PropertiesPage() {
  const allProperties = await db
    .select()
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(50); // Pagination needed in real app

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">Manage real estate listings</p>
        </div>
        <Button asChild>
          <Link href="/properties/new">Add Property</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  {new Intl.NumberFormat("ja-JP", {
                    style: "currency",
                    currency: "JPY",
                  }).format(Number(property.listingPrice))}
                </TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell className="capitalize">{property.buildingType}</TableCell>
                <TableCell className="capitalize">{property.source}</TableCell>
                <TableCell>
                  <Badge variant={property.isActive ? "default" : "secondary"}>
                    {property.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
