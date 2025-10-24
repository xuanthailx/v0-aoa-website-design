"use client"

import { AppHeader } from "@/components/app-header"
import { ContactForm } from "@/components/contact-form"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team and we'll get back to you as
            soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "What is OnboardAI?",
                answer:
                  "OnboardAI is an AI-powered platform that helps organizations quickly onboard and understand their documents through intelligent processing and semantic search.",
              },
              {
                question: "How do I get started?",
                answer:
                  "Simply sign up for an account, upload your documents, and start asking questions. Our AI will process your documents and provide intelligent answers.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Yes, we use enterprise-grade encryption and security measures to protect your data. All data is encrypted in transit and at rest.",
              },
              {
                question: "What file formats are supported?",
                answer:
                  "We support PDF, DOCX, TXT, and many other common document formats. Check our documentation for a complete list.",
              },
              {
                question: "Do you offer API access?",
                answer:
                  "Yes, we provide a comprehensive REST API for developers. Contact our sales team for more information about API access.",
              },
              {
                question: "What is your pricing?",
                answer:
                  "We offer flexible pricing plans for individuals and enterprises. Visit our pricing page or contact us for a custom quote.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-lg border border-border hover:border-primary/50 transition">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
