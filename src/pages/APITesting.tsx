
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function APITesting() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">API Testing Interface</h1>
        <Link to="/test-api">
          <Button variant="default">Go to API Test Flow</Button>
        </Link>
      </div>
    </div>
  );
}
