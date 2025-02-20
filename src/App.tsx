import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import CreateList from "./pages/CreateList";
import CreateCampaign from "./pages/CreateCampaign";
import V1 from "./pages/V1";
import CampaignStatusPage from "./pages/CampaignStatusPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import NumberListsPage from "./pages/NumberListsPage";
import CampaignReviewPage from "./pages/CampaignReviewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create-list" element={<CreateList />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/v1" element={<V1 />} />
        <Route path="/campaign/:campaignId" element={<CampaignStatusPage />} />
        <Route path="/campaign-details/:campaignId" element={<CampaignDetailsPage />} />
        <Route path="/number-lists" element={<NumberListsPage />} />
        <Route path="/campaign-review/:campaignId" element={<CampaignReviewPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
