import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Work from "./pages/Work";
import About from "./pages/About";
import ProjectDetail from "./pages/ProjectDetail";
import AutotraderProject from "./pages/AutotraderProject";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/autotrader-illustrations" element={<AutotraderProject />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
