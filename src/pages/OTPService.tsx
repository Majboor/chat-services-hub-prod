
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
  Shield, 
  Lock, 
  Key, 
  MessageSquare, 
  CheckCircle,
  ArrowRight,
  Server
} from "lucide-react";

export default function OTPService() {
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
              OTP Service
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Secure Verification via WhatsApp – Fast and reliable user authentication
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <Shield className="mr-2 h-5 w-5" />
                Integrate Now
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
                <Lock className="h-5 w-5 text-whatsapp-light" />
                Enhanced Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              State-of-the-art encryption and secure OTP delivery through WhatsApp.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-whatsapp-light" />
                Instant Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              Lightning-fast OTP delivery directly to users' WhatsApp.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-whatsapp-light" />
                Easy Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              Simple API integration with comprehensive documentation and support.
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
              title: "API Integration",
              description: "Integrate our API into your system",
              icon: <Server className="h-6 w-6" />,
            },
            {
              title: "OTP Generation",
              description: "Trigger OTP generation upon user action",
              icon: <Key className="h-6 w-6" />,
            },
            {
              title: "Instant Delivery",
              description: "Deliver OTP via WhatsApp instantly",
              icon: <MessageSquare className="h-6 w-6" />,
            },
            {
              title: "Verification",
              description: "Verify OTP to authenticate user",
              icon: <CheckCircle className="h-6 w-6" />,
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
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Use Cases & Industries</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "E-commerce",
              description: "Secure checkout and account verification",
              icon: <Shield className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Banking",
              description: "Transaction authorization and login security",
              icon: <Lock className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Online Services",
              description: "User registration and authentication",
              icon: <Key className="h-6 w-6 text-whatsapp-light" />,
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
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How easy is the integration process?</AccordionTrigger>
              <AccordionContent>
                Our API integration is straightforward with comprehensive documentation and developer support. Most clients complete the integration within a day.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is the OTP delivery speed?</AccordionTrigger>
              <AccordionContent>
                OTPs are delivered instantly via WhatsApp, typically within milliseconds of generation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do you handle errors and failures?</AccordionTrigger>
              <AccordionContent>
                Our system includes automatic retry mechanisms and real-time monitoring. We provide detailed error logs and notifications for any issues.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Starter",
              price: "$29",
              features: ["1,000 OTPs/month", "Basic Support", "Standard Delivery"],
            },
            {
              title: "Business",
              price: "$99",
              features: ["10,000 OTPs/month", "Priority Support", "Priority Delivery"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited OTPs", "24/7 Support", "Custom Integration"],
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
          <h2 className="text-3xl font-bold mb-4">Enhance Your Security Today</h2>
          <p className="mb-8 text-white/80">Get started with our OTP integration and secure your users</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Start Integration
          </Button>
        </div>
      </section>
    </div>
  );
}
