import { db } from "@ikigai/db";
import { users } from "@ikigai/db/schema/auth"; // Assuming auth schema path
import { desc } from "drizzle-orm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@ikigai/ui/components/table";
import { Badge } from "@ikigai/ui/components/badge";

export default async function UsersPage() {
    // NOTE: Assuming db.select().from(users) works. 
    // If users schema isn't exported directly or is under 'auth', adjust imports.
    // For now, mocking data structure based on auth package usually having 'user' table.

    // Checking if 'users' table exists in exports or if we need to query 'auth' schema.
    // We'll create a safe fallback if the proper export isn't found immediately.

    const allUsers = await db.query.user.findMany({
        orderBy: (users, { desc }) => [desc(users.createdAt)],
        limit: 50,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage platform users</p>
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
