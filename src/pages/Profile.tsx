
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProfileSettings from '@/components/ProfileSettings';
// Removed Tabs imports as they are no longer needed here
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card if needed elsewhere, remove if not
import { useAuth } from '@/contexts/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Profile = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Removed outer Tabs structure */}
          {/* The ProfileSettings component now handles its own tabs */}
          <ProfileSettings />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
