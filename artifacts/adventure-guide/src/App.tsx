import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/AppLayout";
import WizardForm from "@/pages/WizardForm";
import Sheet from "@/pages/Sheet";
import Roster from "@/pages/Roster";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        {/* Home defaults to Hero mode */}
        <Route path="/" component={() => <WizardForm mode="hero" />} />
        <Route path="/tavern" component={() => <WizardForm mode="npc" />} />
        <Route path="/sheet/:id" component={Sheet} />
        <Route path="/roster" component={Roster} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
