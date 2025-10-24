"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { TeamMemberCard } from "@/components/team-member-card"
import { CheckCircle2, Zap, Users, Target } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "AI researcher with 10+ years of experience building intelligent systems.",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Full-stack engineer passionate about scalable architecture and performance.",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
      },
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Product",
      bio: "Product strategist focused on creating intuitive user experiences.",
      socials: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
      },
    },
    {
      name: "David Kim",
      role: "Lead Designer",
      bio: "Design systems expert committed to accessibility and beautiful interfaces.",
      socials: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
      },
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to making AI accessible and beneficial for everyone.",
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every decision we make is guided by our users' needs and feedback.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI.",
    },
    {
      icon: CheckCircle2,
      title: "Quality",
      description: "We maintain the highest standards in our products and services.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">About OnboardAI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building the future of intelligent document processing and knowledge management through cutting-edge
            AI technology.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              OnboardAI was founded in 2023 with a simple mission: to make AI-powered document understanding accessible
              to everyone. Our team recognized that organizations were struggling to extract value from their vast
              repositories of documents.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We built OnboardAI to solve this problem. Our platform combines advanced natural language processing with
              an intuitive interface, allowing teams to quickly onboard documents and get intelligent insights
              instantly.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we're proud to serve hundreds of organizations across various industries, helping them streamline
              their knowledge management and improve decision-making.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">500+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">50K+</p>
                <p className="text-sm text-muted-foreground">Documents Processed</p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">24/7</p>
                <p className="text-sm text-muted-foreground">Support</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border border-border">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We're a diverse team of engineers, designers, and product experts united by a passion for AI and user
            experience.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Our Technology</CardTitle>
              <CardDescription>Built on cutting-edge AI and modern web technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">AI & ML</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Advanced NLP Models
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Semantic Search
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Entity Recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Sentiment Analysis
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Infrastructure</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Cloud-Native Architecture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Scalable Databases
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Real-time Processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      Enterprise Security
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
