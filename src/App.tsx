import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
import ListingDetailPage from "./pages/ListingDetailPage";
import OperatorDetailPage from "./pages/OperatorDetailPage";
import PoiDetailPage from "./pages/PoiDetailPage";

// Import operator pages
import OperatorLanding from "./pages/OperatorLanding";
import OperatorAuth from "./pages/OperatorAuth";
import OperatorOnboarding from "./pages/OperatorOnboarding";
import OperatorSubmissionConfirmation from "./pages/OperatorSubmissionConfirmation";
import OperatorDashboardWrapper from "./pages/OperatorDashboard"; // Updated to use our wrapper

// Import Admin pages/components
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOverview from "./components/admin/overview/AdminOverview";
import AdminOperatorManagement from "./components/admin/operators/AdminOperatorManagement";
import AdminListingManagement from "./components/admin/listings/AdminListingManagement";
import AdminUserManagement from "./components/admin/users/AdminUserManagement";
import AdminContentModeration from "./components/admin/moderation/AdminContentModeration";
import AdminAnalytics from "./components/admin/analytics/AdminAnalytics";
// TODO: Import other admin section components (Settings, etc.) when created

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SpeedInsights />
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
            
            {/* Detail Page Routes */}
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/operator/:id" element={<OperatorDetailPage />} />
            <Route path="/poi/:id" element={<PoiDetailPage />} />

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
                <OperatorDashboardWrapper />
              </AuthRequired>
            } />

            {/* Admin Routes */}
            {/* TODO: Add proper role-based auth check */}
            <Route path="/admin" element={
              <AuthRequired> {/* Basic auth check, needs role check */}
                <AdminDashboardPage />
              </AuthRequired>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="operators" element={<AdminOperatorManagement />} />
              <Route path="listings" element={<AdminListingManagement />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="moderation" element={<AdminContentModeration />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              {/* TODO: Add routes for other admin sections here */}
              {/* <Route path="settings" element={<AdminSettings />} /> */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
