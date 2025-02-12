
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
  Bot, 
  Webhook, 
  LineChart, 
  Bell,
  Lock,
  ChartCandlestick,
  CheckCircle,
  ChartBar,
  MessageSquare
} from "lucide-react";

const TradingDashboard = () => (
  <div className="rounded-lg bg-black/90 p-4 text-white font-mono text-sm space-y-2">
    <div className="text-blue-400">// Trading Bot Status</div>
    <div className="text-green-400">Status: Active ✓</div>
    <div className="text-yellow-400">Current Strategy: Moving Average Crossover</div>
    <div className="text-pink-400">Last Signal: BUY BTC @ $45,000</div>
    <div className="text-blue-400">Profit/Loss: +2.3% (24h)</div>
  </div>
);

export default function TradingBot() {
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
              WhatsApp Trading Bot
            </h1>
            <p className="mt-6 text-xl text-foreground/80 max-w-3xl mx-auto">
              Automate your trading strategies and get real-time updates right on WhatsApp
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-whatsapp-light hover:bg-whatsapp-dark text-white">
                <Bot className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More About Trading Bot
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
                <ChartCandlestick className="h-5 w-5 text-whatsapp-light" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              Real-time market analysis with advanced technical indicators and pattern recognition.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-whatsapp-light" />
                Automated Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              Execute trades automatically based on your pre-defined strategies and risk parameters.
            </CardContent>
          </Card>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-whatsapp-light" />
                Real-time Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              Instant WhatsApp notifications for market movements and trade executions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Trading Dashboard</h2>
        <div className="max-w-3xl mx-auto">
          <TradingDashboard />
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: "Connect Account",
              description: "Link your trading account securely",
              icon: <Lock className="h-6 w-6" />,
            },
            {
              title: "Set Strategy",
              description: "Configure your trading parameters",
              icon: <ChartBar className="h-6 w-6" />,
            },
            {
              title: "Monitor Markets",
              description: "Get real-time market analysis",
              icon: <LineChart className="h-6 w-6" />,
            },
            {
              title: "Auto-Trade",
              description: "Execute trades automatically",
              icon: <Bot className="h-6 w-6" />,
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

      {/* Target Users Section */}
      <section className="section bg-muted/50">
        <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Day Traders",
              description: "Perfect for active traders seeking automation",
              icon: <ChartCandlestick className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Investment Firms",
              description: "Scale your trading operations efficiently",
              icon: <LineChart className="h-6 w-6 text-whatsapp-light" />,
            },
            {
              title: "Retail Investors",
              description: "Stay informed with minimal effort",
              icon: <MessageSquare className="h-6 w-6 text-whatsapp-light" />,
            },
          ].map((user, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {user.icon}
                  {user.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Trading FAQ</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How secure is the trading bot?</AccordionTrigger>
              <AccordionContent>
                Our trading bot uses bank-grade encryption and never stores your private keys. All communications are encrypted end-to-end, and we employ strict security protocols.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Which trading platforms are supported?</AccordionTrigger>
              <AccordionContent>
                We support major exchanges including Binance, Coinbase Pro, and FTX. Additional platforms can be integrated through our API.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is risk management handled?</AccordionTrigger>
              <AccordionContent>
                The bot includes customizable stop-loss, take-profit, and position sizing features. You can set maximum trade sizes and daily loss limits.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section">
        <h2 className="text-3xl font-bold text-center mb-12">Trading Bot Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Basic",
              price: "$49/mo",
              features: ["Basic Strategies", "WhatsApp Alerts", "Manual Trade Execution"],
            },
            {
              title: "Pro",
              price: "$149/mo",
              features: ["Advanced Strategies", "Automated Trading", "Priority Support"],
            },
            {
              title: "Enterprise",
              price: "Custom",
              features: ["Custom Strategies", "API Access", "Dedicated Support"],
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
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Trading?</h2>
          <p className="mb-8 text-white/80">Start trading smarter with our WhatsApp bot today</p>
          <Button size="lg" className="bg-white text-whatsapp-dark hover:bg-white/90">
            Connect Your Account
          </Button>
        </div>
      </section>
    </div>
  );
}
