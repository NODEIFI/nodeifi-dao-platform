import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/error-boundary";

import Home from "@/pages/home";
import News from "@/pages/news";
import Application from "@/pages/application";
import InstantAccess from "@/pages/instant-access";
import WhatsAtStake from "@/pages/whats-at-stake";
import CandyShop from "@/pages/candy-shop";
import Governance from "@/pages/governance";
import ProposalDetail from "@/pages/proposal-detail";
import JourneyToDecentralization from "@/pages/journey-to-decentralization";
import Services from "@/pages/services";
import Performance from "@/pages/performance";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/application" component={Application} />
      <Route path="/instant-access" component={InstantAccess} />
      <Route path="/whats-at-stake" component={WhatsAtStake} />
      <Route path="/candy-shop" component={CandyShop} />
      <Route path="/governance" component={Governance} />
      <Route path="/governance/proposal/:id" component={ProposalDetail} />
      <Route path="/journey-to-decentralization" component={JourneyToDecentralization} />
      <Route path="/services" component={Services} />
      <Route path="/performance" component={Performance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
