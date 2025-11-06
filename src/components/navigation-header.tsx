"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, Home, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { SearchBar } from "./search-bar"
export function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isSearch, setIsSearch] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHomePage = pathname === "/"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-accent transition-colors"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-accent-foreground" />
            </div>
            HealthDirectory
          </Link>
        

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent",
                pathname === "/" ? "text-accent" : "text-muted-foreground",
              )}
            >
              <Home className="h-4 w-4" />
              Directory
            </Link>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <User className="h-4 w-4" />
              For Practitioners
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-6">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 text-lg font-medium transition-colors hover:text-accent",
                    pathname === "/" ? "text-accent" : "text-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Directory
                </Link>
                <Button variant="outline" className="justify-start gap-3 bg-transparent" size="lg">
                  <User className="h-5 w-5" />
                  For Practitioners
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
