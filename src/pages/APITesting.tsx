
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";

export default function APITesting() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold">API Testing Interface</h1>
      </div>
    </div>
  );
}
