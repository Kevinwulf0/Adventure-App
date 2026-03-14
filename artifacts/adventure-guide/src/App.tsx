import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/AppLayout";
import WizardForm from "@/pages/WizardForm";
import Sheet from "@/pages/Sheet";
import Roster from "@/pages/Roster";
import NotFound from "@/pages/not-found";

// This is the global data manager for your app
const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        {/* The 'WizardForm' is where the user will enter details to generate a character */}
        <Route path="/" component={() => <WizardForm mode="hero" />} />
        
        {/* The 'Tavern' is for NPC generation */}
        <Route path="/tavern" component={() => <WizardForm mode="npc" />} />
        
        {/* The 'Sheet' is where our new CharacterCard UI will live! */}
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
        {/* This handles the URL paths so the 'Back' button works in your browser */}
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
