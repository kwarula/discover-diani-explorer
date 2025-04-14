import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext"; // Import the new provider
import { SpeedInsights } from "@vercel/speed-insights/react";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
import AuthCallback from "./pages/AuthCallback";
import AuthDebugger from "./components/debug/AuthDebugger";

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
import AdminRouteGuard from "./components/admin/layout/AdminRouteGuard"; // Import the new guard
import AdminPOIManagement from "./components/admin/poi/AdminPOIManagement"; // Import POI component
// TODO: Import other admin section components (Settings, etc.) when created

// Configure React Query with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404s or other client errors
        if (error instanceof Error && error.message.includes('404')) {
          return false;
        }
        // Retry network errors up to 3 times
        if (failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
      staleTime: 60 * 1000, // 1 minute default stale time
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SpeedInsights />
        {/* Wrap BrowserRouter with GoogleMapsProvider */}
        <GoogleMapsProvider> 
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Auth callback route for OAuth and email confirmation */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Auth debugger/repair tool */}
            <Route path="/auth/debug" element={<AuthDebugger />} />
            
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

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />}>
              <Route element={<AdminRouteGuard />}>
                <Route index element={<AdminOverview />} />
                <Route path="operators" element={<AdminOperatorManagement />} />
                <Route path="listings" element={<AdminListingManagement />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="moderation" element={<AdminContentModeration />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="points-of-interest" element={<AdminPOIManagement />} />
                {/* Add other admin routes when components are ready */}
              </Route>
            </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GoogleMapsProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
