import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; // Assuming index export in contexts/auth
import { LoadingSpinner } from '@/components/ui/loading-spinner'; // Assuming LoadingSpinner exists
import { toast } from 'sonner';

const AdminRouteGuard: React.FC = () => {
  const { user, profile, isLoading } = useAuth(); // Keep profile for potential future use, but don't rely on role yet
  const location = useLocation();

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) { // Only check if user exists
    // User is not logged in
    // Redirect them to the login page, saving the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin or moderator role
  const isAdminOrModerator = profile?.role === 'admin' || profile?.role === 'moderator';
  
  if (!isAdminOrModerator) {
    // User is logged in but doesn't have admin/moderator role
    toast.error('Access denied. You do not have permission to view the admin area.');
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has admin/moderator role
  return <Outlet />;
};

export default AdminRouteGuard;
