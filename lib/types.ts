import type React from "react"
// User and role type definitions for OnboardAI

export type UserRole = "admin" | "developer" | "document_manager"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  lastLogin?: Date
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

export interface Permission {
  action: string
  requiredRoles: UserRole[]
}

export interface ProtectedRouteProps {
  requiredRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export interface Feedback {
  id: string
  userId: string
  category: "bug" | "suggestion" | "feature_request"
  message: string
  sentiment?: "positive" | "negative" | "neutral"
  createdAt: Date
  resolved?: boolean
}

export interface FeedbackContextType {
  feedbacks: Feedback[]
  addFeedback: (feedback: Omit<Feedback, "id" | "createdAt">) => Promise<void>
  isLoading: boolean
}

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: "setup_guide" | "api_docs" | "git_workflow" | "testing_checklist" | "business_overview"
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  title: string
  templateId: string
  uploadedBy: string
  uploadedByName: string
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  approvedBy?: string
  rejectionReason?: string
}

export interface ReindexJob {
  id: string
  status: "pending" | "in_progress" | "completed" | "failed"
  startedAt: Date
  completedAt?: Date
  progress: number
  totalDocuments: number
  processedDocuments: number
  failedDocuments: number
  errorMessage?: string
  initiatedBy: string
}
