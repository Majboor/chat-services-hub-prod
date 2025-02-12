
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
import { Smartphone, CreditCard, CheckCircle, ArrowRight } from "lucide-react";

export default function EWhatsAppSim() {
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
              E-WhatsApp SIM Service
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Activate multiple WhatsApp accounts with our virtual SIM solution
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <CreditCard className="mr-2 h-5 w-5" />
                Activate Your SIM
              </Button>
              <Button size="lg" variant="outline">
                Learn How It Works
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
                <Smartphone className="h-5 w-5 text-whatsapp-light" />
                Multiple Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              Manage multiple WhatsApp accounts seamlessly with our virtual SIM solution.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-whatsapp-light" />
                Instant Activation
              </CardTitle>
            </CardHeader>
            <CardContent>
              Quick and easy activation process with immediate account access.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-whatsapp-light" />
                Reliable Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              Stable and secure connectivity for all your WhatsApp communications.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Register",
              description: "Create your account on our platform",
              icon: <Smartphone className="h-6 w-6" />,
            },
            {
              title: "Choose Package",
              description: "Select your preferred e-SIM package",
              icon: <CreditCard className="h-6 w-6" />,
            },
            {
              title: "Receive Details",
              description: "Get instant activation details via email/SMS",
              icon: <CheckCircle className="h-6 w-6" />,
            },
            {
              title: "Start Using",
              description: "Link to your WhatsApp account and start messaging",
              icon: <ArrowRight className="h-6 w-6" />,
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

      {/* FAQ Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How reliable is the e-SIM service?</AccordionTrigger>
              <AccordionContent>
                Our e-SIM service is built on enterprise-grade infrastructure with 99.9% uptime guarantee, ensuring reliable connectivity for your WhatsApp communications.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long does activation take?</AccordionTrigger>
              <AccordionContent>
                Activation is instant! Once you select your package and complete payment, you'll receive activation details within minutes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I manage multiple WhatsApp accounts?</AccordionTrigger>
              <AccordionContent>
                Yes! Our e-SIM service allows you to manage multiple WhatsApp accounts from a single dashboard, perfect for business needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Starter",
              price: "$9.99",
              features: ["1 WhatsApp Account", "Basic Support", "30-Day Validity"],
            },
            {
              title: "Business",
              price: "$24.99",
              features: ["3 WhatsApp Accounts", "Priority Support", "60-Day Validity"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited Accounts", "24/7 Support", "Custom Validity"],
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-white/80">Activate your e-SIM today and transform your WhatsApp experience</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Activate Your e-SIM Now
          </Button>
        </div>
      </section>
    </div>
  );
}
