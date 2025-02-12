
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Bell,
  Clock,
  Settings,
  Shield,
  Smartphone,
  CheckCircle,
  BellRing,
  Lock,
  BarChart
} from "lucide-react";

const AlertPreview = () => (
  <div className="max-w-sm mx-auto bg-background rounded-xl shadow-lg overflow-hidden">
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <BellRing className="h-4 w-4" />
        <span>Now</span>
      </div>
      <div className="space-y-2">
        <div className="font-medium">🚨 High Priority Alert</div>
        <div className="text-sm text-muted-foreground">
          System maintenance scheduled for tonight at 10 PM EST.
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">View</Button>
        <Button variant="ghost" size="sm">Dismiss</Button>
      </div>
    </div>
  </div>
);

export default function AlertsService() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-whatsapp-light/10 to-whatsapp-dark/10 dark:from-whatsapp-dark/20 dark:to-whatsapp-light/20" />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              WhatsApp Alerts
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Receive instant notifications for important updates and events
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <Bell className="mr-2 h-5 w-5" />
                Configure Alerts
              </Button>
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <section className="section">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-whatsapp-light" />
                Real-time Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              Instant notifications delivered directly to your WhatsApp within seconds.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-whatsapp-light" />
                Customizable Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              Set custom conditions and rules for when you want to receive alerts.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-whatsapp-light" />
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              Enterprise-grade security with 99.9% uptime guarantee.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alert Preview */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Alert Preview</h2>
        <AlertPreview />
      </section>

      {/* How It Works */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Integration",
              description: "Quick setup with your systems",
              icon: <Settings className="h-6 w-6" />,
            },
            {
              title: "Configuration",
              description: "Set your alert preferences",
              icon: <Bell className="h-6 w-6" />,
            },
            {
              title: "Notification",
              description: "Receive instant alerts",
              icon: <Smartphone className="h-6 w-6" />,
            },
            {
              title: "Management",
              description: "Monitor via dashboard",
              icon: <BarChart className="h-6 w-6" />,
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="rounded-full bg-whatsapp-light/10 p-4 inline-flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Alert Applications</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Financial",
              description: "Price alerts & trade notifications",
              icon: <BarChart className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Security",
              description: "System & access alerts",
              icon: <Lock className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Healthcare",
              description: "Appointment reminders",
              icon: <BellRing className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Logistics",
              description: "Delivery status updates",
              icon: <Clock className="h-6 w-6 text-whatsapp-light" />,
            },
          ].map((useCase, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {useCase.icon}
                  {useCase.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {useCase.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How reliable is the alert delivery?</AccordionTrigger>
              <AccordionContent>
                Our system maintains a 99.9% uptime with redundant infrastructure. Alerts are typically delivered within seconds of being triggered.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I customize alert settings?</AccordionTrigger>
              <AccordionContent>
                Yes, you can customize alert triggers, frequency, priority levels, and delivery schedules through our intuitive dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How secure are the notifications?</AccordionTrigger>
              <AccordionContent>
                All alerts are end-to-end encrypted and transmitted through WhatsApp's secure infrastructure. We follow strict data protection protocols.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Alert Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Basic",
              price: "$29/mo",
              features: ["100 Alerts/month", "Basic Templates", "Email Support"],
            },
            {
              title: "Business",
              price: "$99/mo",
              features: ["1000 Alerts/month", "Custom Templates", "Priority Support"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited Alerts", "API Access", "24/7 Support"],
            },
          ].map((plan, index) => (
            <Card key={index} className={index === 1 ? "border-whatsapp-light" : ""}>
              <CardHeader>
                <CardTitle className="text-center">{plan.title}</CardTitle>
                <div className="text-3xl font-bold text-center">{plan.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-whatsapp-light" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-whatsapp-light hover:bg-whatsapp-dark">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-whatsapp-dark text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed with WhatsApp Alerts</h2>
          <p className="mb-8 text-white/80">Set up your first alert in minutes</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Set Up Alerts
          </Button>
        </div>
      </section>
    </div>
  );
}
