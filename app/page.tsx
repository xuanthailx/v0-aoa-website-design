import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-lg text-foreground">OnboardAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              How it Works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance">AI-Powered Onboarding</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Upload documents, get instant insights, and accelerate your onboarding process with intelligent AI
              assistance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Document Upload",
              description: "Upload any document format and let AI extract key information automatically.",
            },
            {
              title: "Intelligent Chat",
              description: "Ask questions about your documents and get instant, accurate answers.",
            },
            { title: "Knowledge Base", description: "Build a searchable knowledge base from your documents." },
            { title: "Analytics Dashboard", description: "Track usage, engagement, and key metrics in real-time." },
            { title: "Admin Controls", description: "Manage users, documents, and system settings with ease." },
            { title: "Secure & Private", description: "Enterprise-grade security with end-to-end encryption." },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition">
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold text-foreground">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams using OnboardAI to streamline their onboarding process.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 OnboardAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
