"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { useAuth } from "@/lib/auth-context"
import { canPerformAction } from "@/lib/rbac"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("account")
  const [settings, setSettings] = useState({
    email: "user@example.com",
    name: "John Doe",
    company: "Acme Corp",
    apiKey: "sk_live_••••••••••••••••",
    maxDocuments: "100",
    maxUsers: "50",
    theme: "light",
  })

  const [featureToggles, setFeatureToggles] = useState({
    feedbackModal: true,
    autoSync: true,
    showAnalytics: true,
    advancedSearch: false,
  })

  const [integrations, setIntegrations] = useState([
    { id: "openai", name: "OpenAI", status: "connected", apiKey: "sk_••••••••" },
    { id: "notion", name: "Notion", status: "not_connected", apiKey: "" },
    { id: "confluence", name: "Confluence", status: "connected", apiKey: "••••••••" },
    { id: "github", name: "GitHub", status: "not_connected", apiKey: "" },
  ])

  const isAdmin = user?.role === "admin"
  const canViewOrganization = user && canPerformAction(user.role, "settings:view_full")
  const canManageUsers = user && canPerformAction(user.role, "settings:manage_users")
  const canManageIntegrations = user && canPerformAction(user.role, "settings:manage_integrations")

  const tabs = [
    { id: "account", label: "Account" },
    ...(canViewOrganization ? [{ id: "organization", label: "Organization" }] : []),
    ...(canManageIntegrations ? [{ id: "api", label: "API & Integration" }] : []),
    ...(isAdmin ? [{ id: "features", label: "Feature Toggles" }] : []),
    ...(isAdmin ? [{ id: "backup", label: "Backup & Restore" }] : []),
    { id: "security", label: "Security" },
  ]

  const handleToggleFeature = (feature: string) => {
    setFeatureToggles((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const handleIntegrationConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId ? { ...int, status: int.status === "connected" ? "not_connected" : "connected" } : int,
      ),
    )
  }

  const handleBackup = async () => {
    try {
      const response = await fetch("/api/admin/backup", { method: "POST" })
      const data = await response.json()
      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data)))
      element.setAttribute("download", `onboardai-backup-${new Date().toISOString()}.json`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error("Backup failed:", error)
    }
  }

  return (
    <ProtectedRoute requiredRoles={["admin", "developer", "document_manager"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account, organization, and system preferences.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-surface"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                        <Input
                          value={settings.name}
                          onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                        <Input
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
                        <select className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground">
                          <option>Light</option>
                          <option>Dark</option>
                          <option>Auto</option>
                        </select>
                      </div>
                      <Button>Save Preferences</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Organization Settings - Admin Only */}
              {activeTab === "organization" && canViewOrganization && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Organization Details</CardTitle>
                      <CardDescription>Manage your organization information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Company Name</label>
                        <Input
                          value={settings.company}
                          onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Max Documents</label>
                        <Input
                          type="number"
                          value={settings.maxDocuments}
                          onChange={(e) => setSettings({ ...settings, maxDocuments: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Max Users</label>
                        <Input
                          type="number"
                          value={settings.maxUsers}
                          onChange={(e) => setSettings({ ...settings, maxUsers: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <Button>Save Organization Settings</Button>
                    </CardContent>
                  </Card>

                  {canManageUsers && (
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Manage users and their permissions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "John Doe", email: "john@example.com", role: "Admin" },
                            { name: "Jane Smith", email: "jane@example.com", role: "Developer" },
                            { name: "Bob Johnson", email: "bob@example.com", role: "Document Manager" },
                          ].map((member, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-lg border border-border"
                            >
                              <div>
                                <p className="font-medium text-foreground">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-primary">{member.role}</span>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="mt-4">Invite Team Member</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "features" && isAdmin && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Feature Toggles</CardTitle>
                      <CardDescription>Enable or disable features for your organization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(featureToggles).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div>
                            <p className="font-medium text-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {key === "feedbackModal" && "Allow users to submit feedback"}
                              {key === "autoSync" && "Automatically sync documents"}
                              {key === "showAnalytics" && "Display analytics dashboard"}
                              {key === "advancedSearch" && "Enable advanced search features"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleFeature(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              value ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                value ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                      <Button className="mt-4">Save Feature Settings</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "backup" && isAdmin && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Backup & Restore</CardTitle>
                      <CardDescription>Manage your data backups and restore points</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-surface border border-border">
                        <p className="text-sm text-foreground mb-4">
                          Create a backup of all your documents, settings, and configurations. You can restore from this
                          backup at any time.
                        </p>
                        <Button onClick={handleBackup}>Create Backup Now</Button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium text-foreground">Recent Backups</h3>
                        {[
                          { date: "2024-01-15 14:30", size: "2.4 MB", status: "completed" },
                          { date: "2024-01-14 10:15", size: "2.3 MB", status: "completed" },
                          { date: "2024-01-13 09:45", size: "2.2 MB", status: "completed" },
                        ].map((backup, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div>
                              <p className="font-medium text-foreground">{backup.date}</p>
                              <p className="text-sm text-muted-foreground">{backup.size}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                              <Button variant="outline" size="sm">
                                Restore
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "api" && canManageIntegrations && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>Manage your API keys for integrations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">API Key</label>
                        <div className="flex gap-2">
                          <Input type="password" value={settings.apiKey} readOnly className="bg-input border-border" />
                          <Button variant="outline">Copy</Button>
                        </div>
                      </div>
                      <Button>Regenerate API Key</Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Third-Party Integrations</CardTitle>
                      <CardDescription>Connect and configure external services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {integrations.map((integration) => (
                          <div
                            key={integration.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary">{integration.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{integration.name}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {integration.status.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleIntegrationConnect(integration.id)}
                            >
                              {integration.status === "connected" ? "Disconnect" : "Connect"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password regularly to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
                        <Input type="password" placeholder="••••••••" className="bg-input border-border" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                        <Input type="password" placeholder="••••••••" className="bg-input border-border" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
                        <Input type="password" placeholder="••••••••" className="bg-input border-border" />
                      </div>
                      <Button>Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Two-factor authentication is currently disabled. Enable it to secure your account.
                      </p>
                      <Button>Enable 2FA</Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle>Active Sessions</CardTitle>
                      <CardDescription>Manage your active sessions across devices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { device: "Chrome on macOS", location: "San Francisco, CA", lastActive: "Now" },
                          { device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2 hours ago" },
                        ].map((session, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-border"
                          >
                            <div>
                              <p className="font-medium text-foreground">{session.device}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.location} • {session.lastActive}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Sign Out
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
