
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
  Shield, 
  Lock,
  UserX,
  Send,
  User,
  Settings,
  CheckCircle,
  ChevronRight,
  HelpCircle
} from "lucide-react";

const ProcessStep = ({ icon: Icon, title, description }: { 
  icon: any, 
  title: string, 
  description: string 
}) => (
  <div className="flex items-start gap-4">
    <div className="rounded-full bg-whatsapp-light/10 p-3">
      <Icon className="h-6 w-6 text-whatsapp-light" />
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default function AnonymousMessage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      
      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 dark:from-gray-950/90 dark:to-gray-900/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-whatsapp-light/10 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Anonymous WhatsApp Messaging
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Send secure, confidential messages without revealing your identity
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <MessageSquare className="mr-2 h-5 w-5" />
                Try It Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white bg-white/5 border-white/40 hover:bg-white/20 hover:border-white/60 transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <section className="section bg-muted/50">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Our anonymous messaging service provides a secure way to communicate while maintaining your privacy. 
            With end-to-end encryption and advanced anonymity features, your identity remains protected.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-whatsapp-light" />
                End-to-End Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              Your messages are encrypted from start to finish, ensuring complete privacy and security.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-whatsapp-light" />
                Identity Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              Advanced masking technology keeps your identity completely hidden from recipients.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-whatsapp-light" />
                Quick Dispatch
              </CardTitle>
            </CardHeader>
            <CardContent>
              Send messages instantly without compromising your personal information.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Step-by-Step Process</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          <ProcessStep 
            icon={User}
            title="Create Your Account"
            description="Sign up securely with minimal information required"
          />
          <ProcessStep 
            icon={Settings}
            title="Configure Anonymity"
            description="Choose your privacy settings and customize sender ID"
          />
          <ProcessStep 
            icon={Send}
            title="Send Messages"
            description="Compose and send your message with complete privacy"
          />
        </div>
      </section>

      {/* Use Cases */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Whistleblowing",
              description: "Securely report issues while protecting your identity",
              icon: Shield,
            },
            {
              title: "Anonymous Feedback",
              description: "Provide honest feedback without fear of repercussions",
              icon: MessageSquare,
            },
            {
              title: "Secure Communications",
              description: "Exchange sensitive information privately",
              icon: Lock,
            },
          ].map((useCase, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <useCase.icon className="h-5 w-5 text-whatsapp-light" />
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

      {/* Testimonials */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              quote: "The anonymous messaging feature helped our organization implement a truly confidential feedback system.",
              author: "HR Director",
            },
            {
              quote: "Finally, a secure way to communicate sensitive information without compromising privacy.",
              author: "Security Consultant",
            },
          ].map((testimonial, index) => (
            <Card key={index} className="glass">
              <CardContent className="pt-6">
                <p className="text-lg mb-4">{testimonial.quote}</p>
                <p className="text-sm text-muted-foreground">- {testimonial.author}</p>
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
              <AccordionTrigger>How secure is the messaging service?</AccordionTrigger>
              <AccordionContent>
                We use military-grade encryption and advanced anonymity protocols. Your messages are encrypted end-to-end, and we don't store any identifying information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can recipients trace messages back to me?</AccordionTrigger>
              <AccordionContent>
                No, our system uses advanced masking technology to ensure your identity remains completely hidden from recipients.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are there message limits?</AccordionTrigger>
              <AccordionContent>
                Message limits vary by plan. Free users can send up to 10 anonymous messages per day, while premium users enjoy unlimited messaging.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="text-center mt-8">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Still have questions? Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Basic",
              price: "Free",
              features: ["10 messages/day", "Basic anonymity", "Standard support"],
            },
            {
              title: "Pro",
              price: "$9.99/mo",
              features: ["Unlimited messages", "Advanced privacy", "Priority support"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Custom solutions", "API access", "24/7 support"],
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
          <h2 className="text-3xl font-bold mb-4">Ready to Start Messaging Anonymously?</h2>
          <p className="mb-8 text-white/80">Join thousands of users who trust our secure messaging platform</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
