
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import CreateList from "./pages/CreateList";
import CreateCampaign from "./pages/CreateCampaign";
import V1 from "./pages/V1";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create-list" element={<CreateList />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/v1" element={<V1 />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
