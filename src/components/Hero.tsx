
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-whatsapp-light/10 to-whatsapp-dark/10 dark:from-whatsapp-dark/20 dark:to-whatsapp-light/20" />
      </div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Empower Your Business with Advanced WhatsApp Solutions
          </h1>
          <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
            From anonymous messaging to bulk surveys, API integrations, and trading bots – 
            everything you need in one platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
              <MessageSquare className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
