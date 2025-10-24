// Role-Based Access Control utilities

import type { UserRole } from "./types"

export const ROLES = {
  ADMIN: "admin" as const,
  DEVELOPER: "developer" as const,
  DOCUMENT_MANAGER: "document_manager" as const,
}

// Role hierarchy: Admin > Document Manager > Developer
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  document_manager: 2,
  developer: 1,
}

// Permission matrix: which roles can access which features
export const PERMISSIONS: Record<string, UserRole[]> = {
  // Chat features
  "chat:access": ["admin", "developer", "document_manager"],
  "chat:send_message": ["admin", "developer", "document_manager"],
  "chat:view_history": ["admin", "developer", "document_manager"],

  // Knowledge Base features
  "kb:view": ["admin", "developer", "document_manager"],
  "kb:upload_document": ["admin", "document_manager"],
  "kb:delete_document": ["admin", "document_manager"],
  "kb:approve_document": ["admin"],
  "kb:reject_document": ["admin"],
  "kb:reindex": ["admin"],
  "kb:manage_templates": ["admin"],

  // Analytics features
  "analytics:view_full": ["admin"],
  "analytics:view_limited": ["admin", "developer", "document_manager"],
  "analytics:export": ["admin"],

  // Settings features
  "settings:view_full": ["admin"],
  "settings:view_account": ["admin", "developer", "document_manager"],
  "settings:manage_users": ["admin"],
  "settings:manage_integrations": ["admin"],
  "settings:manage_templates": ["admin"],

  // Admin features
  "admin:access": ["admin"],
  "admin:user_management": ["admin"],
  "admin:feedback_reports": ["admin"],
}

// Check if user has a specific role
export function hasRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return userRole === requiredRole
}

// Check if user has any of the required roles
export function hasAnyRole(userRole: UserRole | null, requiredRoles: UserRole[]): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}

// Check if user can perform an action
export function canPerformAction(userRole: UserRole | null, action: string): boolean {
  if (!userRole) return false
  const requiredRoles = PERMISSIONS[action]
  if (!requiredRoles) return false
  return requiredRoles.includes(userRole)
}

// Check if user can access a page
export function canAccessPage(userRole: UserRole | null, requiredRoles: UserRole[]): boolean {
  return hasAnyRole(userRole, requiredRoles)
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: "Administrator",
    developer: "Developer",
    document_manager: "Document Manager",
  }
  return names[role]
}

// Get role color for UI
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: "bg-red-500",
    developer: "bg-blue-500",
    document_manager: "bg-green-500",
  }
  return colors[role]
}
