"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"

interface TeamMemberCardProps {
  name: string
  role: string
  bio: string
  image?: string
  socials?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

export function TeamMemberCard({ name, role, bio, image, socials }: TeamMemberCardProps) {
  return (
    <Card className="border border-border hover:border-primary/50 transition overflow-hidden">
      {image && (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-4xl font-bold text-primary/30">{name.charAt(0)}</div>
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-primary font-medium mb-3">{role}</p>
        <p className="text-sm text-muted-foreground mb-4">{bio}</p>

        {socials && (
          <div className="flex gap-2">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
