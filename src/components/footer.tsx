import Link from "next/link"
import { Search, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 mt-20">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-accent-foreground" />
              </div>
              HealthDirectory
            </Link>
            <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
              Find qualified healthcare and aesthetic practitioners in your area. Verified profiles, authentic reviews,
              and regulatory compliance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Browse Practitioners
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Advanced Search
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Categories
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* For Practitioners */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">For Practitioners</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Join Directory
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Update Profile
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Verification Process
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@healthdirectory.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+44 20 1234 5678</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 HealthDirectory. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
