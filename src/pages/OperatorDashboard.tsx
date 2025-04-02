
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { OperatorStatus } from '@/types/database';

const OperatorDashboard: React.FC = () => {
  // Example operator status - replace with actual data fetch
  const operatorStatus: OperatorStatus = 'pending_verification';
  const isLoading = false;

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading Operator Dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

      {operatorStatus === 'pending_verification' && (
        <Alert variant="default" className="mb-6 bg-yellow-100 border-yellow-400 text-yellow-800">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Verification Pending</AlertTitle>
          <AlertDescription>
            Your application is currently under review. You can familiarize yourself with the dashboard,
            but full functionality (like creating listings) will be enabled upon approval.
          </AlertDescription>
        </Alert>
      )}

      {operatorStatus === 'rejected' && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Application Rejected</AlertTitle>
          <AlertDescription>
            Unfortunately, your application could not be approved at this time. Please check your email for details and required actions.
          </AlertDescription>
        </Alert>
      )}

      {operatorStatus === 'needs_info' && (
        <Alert variant="default" className="mb-6 bg-blue-100 border-blue-400 text-blue-800">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            We need some additional information to complete your verification. Please check your email for details on what is required.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">My Listings</h2>
          <p className="text-gray-500">(Listings management will go here)</p>
          {operatorStatus !== 'verified' && <p className="text-sm text-red-500">(Disabled until verified)</p>}
        </div>
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
          <p className="text-gray-500">(Edit profile details)</p>
        </div>
        <div className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-500">(View performance metrics)</p>
          {operatorStatus !== 'verified' && <p className="text-sm text-red-500">(Disabled until verified)</p>}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
