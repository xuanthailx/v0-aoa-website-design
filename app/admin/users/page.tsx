"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { RoleBadge } from "@/components/role-badge"
import { Trash2, Edit2, Plus } from "lucide-react"
import type { User } from "@/lib/types"

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      createdAt: new Date("2024-01-15"),
      lastLogin: new Date(),
    },
    {
      id: "2",
      email: "dev@example.com",
      name: "Developer User",
      role: "developer",
      createdAt: new Date("2024-02-20"),
      lastLogin: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      email: "manager@example.com",
      name: "Document Manager",
      role: "document_manager",
      createdAt: new Date("2024-03-10"),
      lastLogin: new Date(Date.now() - 172800000),
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">Manage users and their roles in your organization.</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border max-w-md"
            />
          </div>

          {/* Users Table */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Total users: {users.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="py-3 px-4 text-foreground">{user.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-4">
                          <RoleBadge role={user.role} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.createdAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.lastLogin?.toLocaleDateString() || "Never"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
