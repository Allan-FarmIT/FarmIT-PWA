import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Home from "@/pages/home";
import Scan from "@/pages/scan";
import Results from "@/pages/results";
import FarmManagement from "@/pages/farm-management";
import Agrovets from "@/pages/agrovets";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/scan" component={Scan} />
          <Route path="/results" component={Results} />
          <Route path="/farm" component={FarmManagement} />
          <Route path="/agrovets" component={Agrovets} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;