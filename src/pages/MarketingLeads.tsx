
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
  MessageSquare, 
  BarChart, 
  Target, 
  Users,
  ChartLine,
  LayoutDashboard,
  Megaphone,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function MarketingLeads() {
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
              WhatsApp Marketing & Leads Bundle
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Reach thousands and get high-quality leads with our all-in-one marketing solution
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <Megaphone className="mr-2 h-5 w-5" />
                Start Your Campaign
              </Button>
              <Button size="lg" variant="outline">
                Explore Bundle Details
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
                <Target className="h-5 w-5 text-whatsapp-light" />
                Smart Targeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              Advanced segmentation tools for precise audience targeting and higher conversion rates.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-whatsapp-light" />
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              Comprehensive dashboard with real-time campaign performance metrics.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-whatsapp-light" />
                Campaign Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              Automated messaging and follow-ups for efficient lead nurturing.
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
              title: "Choose Package",
              description: "Select your marketing package and bundle options",
              icon: <Target className="h-6 w-6" />,
            },
            {
              title: "Design Campaign",
              description: "Create engaging campaigns with our tools",
              icon: <LayoutDashboard className="h-6 w-6" />,
            },
            {
              title: "Launch & Track",
              description: "Monitor performance in real-time",
              icon: <ChartLine className="h-6 w-6" />,
            },
            {
              title: "Generate Leads",
              description: "Convert viewers into valuable leads",
              icon: <Users className="h-6 w-6" />,
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
        <h2 className="text-3xl font-bold text-center mb-12">Perfect For Every Business</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Retail",
              description: "Drive sales with targeted promotions",
            },
            {
              title: "Services",
              description: "Connect with potential clients",
            },
            {
              title: "E-commerce",
              description: "Boost online store conversions",
            },
            {
              title: "Agencies",
              description: "Scale client campaigns effectively",
            },
          ].map((useCase, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="text-center">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
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
              <AccordionTrigger>How do you ensure lead quality?</AccordionTrigger>
              <AccordionContent>
                We use advanced verification processes and machine learning to ensure high-quality leads. Each lead is validated against multiple data points before being passed to you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I integrate with my existing CRM?</AccordionTrigger>
              <AccordionContent>
                Yes! Our platform integrates seamlessly with major CRM solutions including Salesforce, HubSpot, and more through our API.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What metrics can I track?</AccordionTrigger>
              <AccordionContent>
                Track engagement rates, conversion metrics, ROI, lead quality scores, and more through our comprehensive analytics dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Marketing & Leads Bundles</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Starter Bundle",
              price: "$199",
              features: ["500 Marketing Messages", "100 Verified Leads", "Basic Analytics"],
            },
            {
              title: "Growth Bundle",
              price: "$499",
              features: ["2000 Marketing Messages", "500 Verified Leads", "Advanced Analytics"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited Messages", "Custom Lead Volume", "Full Suite Access"],
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
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-whatsapp-dark text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="mb-8 text-white/80">Start generating quality leads through WhatsApp marketing today</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Launch Your Campaign
          </Button>
        </div>
      </section>
    </div>
  );
}
