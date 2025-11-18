import { Button } from "@/components/ui/button"
export default function Header() {
    return (
        <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="font-bold text-xl">CONSENTZ.</div>
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#" className="text-sm text-gray-600 hover:text-black">HOME</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">FEATURES</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">BLOG</a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">FAQS</a>
          </nav>
          <Button className="text-sm border border-black bg-transparent text-black hover:bg-black hover:text-white">
            BOOK DEMO
          </Button>
        </div>
      </header>
    )
}