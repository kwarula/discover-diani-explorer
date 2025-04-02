
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import Explore from "./pages/Explore";
import Activities from "./pages/Activities";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import AuthRequired from "./components/AuthRequired";
import BeachSafety from "./pages/BeachSafety";
import TravelTips from "./pages/TravelTips";
import WeatherForecast from "./pages/WeatherForecast";
import LocalCustoms from "./pages/LocalCustoms";
import Transportation from "./pages/Transportation";

// Import operator pages
import OperatorLanding from "./pages/OperatorLanding";
import OperatorAuth from "./pages/OperatorAuth";
import OperatorOnboarding from "./pages/OperatorOnboarding";
import OperatorSubmissionConfirmation from "./pages/OperatorSubmissionConfirmation";
import OperatorDashboard from "./pages/OperatorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <AuthRequired>
                <Dashboard />
              </AuthRequired>
            } />
            <Route path="/profile" element={
              <AuthRequired>
                <Profile />
              </AuthRequired>
            } />
            <Route path="/blog" element={<Blog />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/market" element={<Market />} />

            {/* Resource Pages */}
            <Route path="/beach-safety" element={<BeachSafety />} />
            <Route path="/travel-tips" element={<TravelTips />} />
            <Route path="/weather-forecast" element={<WeatherForecast />} />
            <Route path="/local-customs" element={<LocalCustoms />} />
            <Route path="/transportation" element={<Transportation />} />

            {/* Operator Flow Routes */}
            <Route path="/operator/welcome" element={<OperatorLanding />} />
            <Route path="/operator/auth" element={<OperatorAuth />} />
            {/* Wrap onboarding, confirmation, and dashboard in AuthRequired */}
            <Route path="/operator/onboarding" element={
              <AuthRequired>
                <OperatorOnboarding />
              </AuthRequired>
            } />
             <Route path="/operator/submission-confirmation" element={
              <AuthRequired>
                <OperatorSubmissionConfirmation />
              </AuthRequired>
            } />
             <Route path="/operator/dashboard" element={
              <AuthRequired>
                <OperatorDashboard />
              </AuthRequired>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
