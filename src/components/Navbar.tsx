
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 blur-bg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-whatsapp-light to-whatsapp-dark bg-clip-text text-transparent">
              WhatsApp Services
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#services" className="text-foreground/80 hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-4"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
              Get Started
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} blur-bg border-b`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-background/50 transition-colors"
          >
            Home
          </a>
          <a
            href="#services"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-background/50 transition-colors"
          >
            Services
          </a>
          <a
            href="#pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-background/50 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-background/50 transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-foreground hover:bg-background/50 transition-colors"
          >
            Contact
          </a>
          <div className="px-3 py-2">
            <Button className="w-full bg-whatsapp-light hover:bg-whatsapp-dark text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
