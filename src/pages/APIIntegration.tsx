
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
  Code, 
  Server, 
  Shield, 
  Database,
  BarChart,
  Key,
  CheckCircle,
  Globe,
  MessageSquare
} from "lucide-react";

const CodeSnippet = () => (
  <div className="rounded-lg bg-black/90 p-4 text-white font-mono text-sm">
    <div className="text-blue-400">// Initialize WhatsApp API client</div>
    <div className="text-green-400">const whatsapp = new WhatsAppAPI(apiKey);</div>
    <br />
    <div className="text-blue-400">// Send a message</div>
    <div className="text-green-400">await whatsapp.sendMessage{'({'}</div>
    <div className="ml-4 text-yellow-400">  to: "+1234567890",</div>
    <div className="ml-4 text-yellow-400">  message: "Hello from API!"</div>
    <div className="text-green-400">{'});'}</div>
  </div>
);

export default function APIIntegration() {
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
              WhatsApp API Integration
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Seamlessly integrate WhatsApp messaging into your applications
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <Key className="mr-2 h-5 w-5" />
                Get API Access
              </Button>
              <Button size="lg" variant="outline">
                <Code className="mr-2 h-5 w-5" />
                Read Documentation
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
                <Globe className="h-5 w-5 text-whatsapp-light" />
                Global Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              Reach users worldwide with reliable message delivery and scalable infrastructure.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-whatsapp-light" />
                Secure Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              Enterprise-grade security with end-to-end encryption and authentication.
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
              Comprehensive dashboards for monitoring message delivery and engagement.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Sample Section */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Integration</h2>
        <div className="max-w-3xl mx-auto">
          <CodeSnippet />
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Integration Process</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Get API Key",
              description: "Sign up and obtain your API credentials",
              icon: <Key className="h-6 w-6" />,
            },
            {
              title: "Integration",
              description: "Follow our comprehensive documentation",
              icon: <Code className="h-6 w-6" />,
            },
            {
              title: "Testing",
              description: "Test in our sandbox environment",
              icon: <Server className="h-6 w-6" />,
            },
            {
              title: "Monitor",
              description: "Track performance in real-time",
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
        <h2 className="text-3xl font-bold text-center mb-12">API Applications</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "CRM Integration",
              description: "Seamlessly connect with your existing CRM system",
              icon: <Database className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Customer Support",
              description: "Automate support workflows and responses",
              icon: <MessageSquare className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Notifications",
              description: "Send automated alerts and updates",
              icon: <Globe className="h-6 w-6 text-whatsapp-light" />,
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
        <h2 className="text-3xl font-bold text-center mb-12">Technical FAQ</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>What are the API rate limits?</AccordionTrigger>
              <AccordionContent>
                Rate limits vary by plan. Basic plans start at 1000 messages per day, while enterprise plans offer custom limits based on needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How is API security handled?</AccordionTrigger>
              <AccordionContent>
                We use industry-standard OAuth 2.0 authentication and HTTPS encryption. All API keys are encrypted and messages are end-to-end encrypted.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What programming languages are supported?</AccordionTrigger>
              <AccordionContent>
                Our API supports all major programming languages through REST endpoints. We provide SDKs for Python, Node.js, Java, and PHP.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">API Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Basic",
              price: "$99/mo",
              features: ["1,000 messages/day", "Basic Support", "REST API Access"],
            },
            {
              title: "Business",
              price: "$299/mo",
              features: ["10,000 messages/day", "Priority Support", "Advanced Analytics"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited messages", "24/7 Support", "Custom Integration"],
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
          <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
          <p className="mb-8 text-white/80">Start building with our WhatsApp API today</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Get API Access
          </Button>
        </div>
      </section>
    </div>
  );
}
