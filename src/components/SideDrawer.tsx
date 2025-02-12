
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Anonymous WhatsApp Message",
    path: "/anonymous-message",
  },
  {
    title: "E-WhatsApp SIM Service",
    path: "/e-whatsapp-sim",
  },
  {
    title: "OTP Service",
    path: "/otp-service",
  },
  {
    title: "WhatsApp Marketing & Leads",
    path: "/marketing-leads",
  },
  {
    title: "Bulk Surveys",
    path: "/bulk-surveys",
  },
  {
    title: "WhatsApp API Integration",
    path: "/api-integration",
  },
  {
    title: "WhatsApp Trading Bot",
    path: "/trading-bot",
  },
  {
    title: "WhatsApp Alerts Service",
    path: "/alerts-service",
  },
];

export function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed right-4 top-20 z-50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center mb-4">
              Our Services
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-lg font-medium"
                onClick={() => handleNavigation(item.path)}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
