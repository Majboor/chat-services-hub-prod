
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
  ClipboardList, 
  BarChart, 
  Users, 
  FileSpreadsheet,
  MessageSquare,
  LayoutDashboard,
  CheckCircle,
  ArrowRight,
  PieChart
} from "lucide-react";

export default function BulkSurveys() {
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
              Bulk Surveys via WhatsApp
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Collect feedback and insights from thousands instantly
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <ClipboardList className="mr-2 h-5 w-5" />
                Start a Survey
              </Button>
              <Button size="lg" variant="outline">
                Learn the Process
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
                <LayoutDashboard className="h-5 w-5 text-whatsapp-light" />
                Easy Survey Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              Intuitive survey builder with customizable templates and question types.
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
              Track responses and analyze data in real-time with interactive dashboards.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-whatsapp-light" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              Export survey data in multiple formats for detailed analysis.
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
              title: "Design Survey",
              description: "Create surveys with our intuitive tool",
              icon: <ClipboardList className="h-6 w-6" />,
            },
            {
              title: "Broadcast",
              description: "Send surveys via WhatsApp",
              icon: <MessageSquare className="h-6 w-6" />,
            },
            {
              title: "Collect Data",
              description: "Gather responses in real-time",
              icon: <BarChart className="h-6 w-6" />,
            },
            {
              title: "Analyze",
              description: "Generate insights from responses",
              icon: <PieChart className="h-6 w-6" />,
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
        <h2 className="text-3xl font-bold text-center mb-12">Survey Applications</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Market Research",
              description: "Understand market trends and customer preferences",
              icon: <Users className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Customer Feedback",
              description: "Measure satisfaction and gather product feedback",
              icon: <MessageSquare className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Employee Surveys",
              description: "Collect internal feedback and improve engagement",
              icon: <ClipboardList className="h-6 w-6 text-whatsapp-light" />,
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
              <AccordionTrigger>How customizable are the surveys?</AccordionTrigger>
              <AccordionContent>
                Our surveys support multiple question types including multiple choice, rating scales, and open-ended responses. You can also customize the look and feel to match your brand.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What response rates can I expect?</AccordionTrigger>
              <AccordionContent>
                WhatsApp surveys typically achieve 40-60% response rates, significantly higher than email surveys, thanks to the platform's high engagement rates.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is data privacy handled?</AccordionTrigger>
              <AccordionContent>
                We follow strict data protection guidelines and GDPR compliance. All survey responses are encrypted and stored securely.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Survey Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Basic",
              price: "$49/mo",
              features: ["100 Responses/month", "Basic Templates", "CSV Export"],
            },
            {
              title: "Professional",
              price: "$149/mo",
              features: ["1000 Responses/month", "Advanced Templates", "Real-time Analytics"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Unlimited Responses", "Custom Templates", "API Access"],
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
          <h2 className="text-3xl font-bold mb-4">Start Collecting Insights Today</h2>
          <p className="mb-8 text-white/80">Create your first survey and reach thousands instantly</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Create Survey Now
          </Button>
        </div>
      </section>
    </div>
  );
}
