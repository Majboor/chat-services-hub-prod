
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { SideDrawer } from "@/components/SideDrawer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <Hero />
    </div>
  );
}
