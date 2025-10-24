"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit form")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              We'd love to hear from you. Fill out the form below and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✓</div>
                <p className="font-semibold text-foreground mb-1">Message Sent!</p>
                <p className="text-sm text-muted-foreground">Thank you for reaching out. We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={5}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a href="mailto:support@onboardai.com" className="text-sm text-primary hover:underline">
                  support@onboardai.com
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Phone</p>
                <a href="tel:+1234567890" className="text-sm text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-muted-foreground">123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monday - Friday</span>
              <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturday</span>
              <span className="font-medium text-foreground">10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sunday</span>
              <span className="font-medium text-foreground">Closed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
