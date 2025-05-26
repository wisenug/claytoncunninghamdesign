
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";

// Import pages
import Layout from "./components/Layout";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import AutotraderIcons from "./pages/AutotraderIcons";
import AutotraderIllustrationSimplified from "./pages/AutotraderIllustrationSimplified";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Grayscale from "./pages/Grayscale";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/projects/autotrader-icons" element={<AutotraderIcons />} />
          <Route path="/projects/autotrader-illustration-simplified" element={<AutotraderIllustrationSimplified />} />
          <Route path="/projects/grayscale" element={<Grayscale />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </QueryClientProvider>
);

export default App;
