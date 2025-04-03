import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Users, ListChecks, ShieldAlert, UserCheck } from 'lucide-react';

// Placeholder data - replace with actual data fetching
const stats = {
  pendingOperators: 5,
  pendingListings: 12,
  flaggedContent: 3,
  activeUsers: 150,
  verifiedOperators: 45,
};
const isLoading = false; // Set to true while fetching data

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Operators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.pendingOperators}</div>
            )}
            <Button variant="link" asChild className="text-xs text-muted-foreground px-0">
              <Link to="/admin/operators?status=pending">
                View Pending <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Listings</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.pendingListings}</div>
            )}
             <Button variant="link" asChild className="text-xs text-muted-foreground px-0">
              <Link to="/admin/listings?status=pending">
                View Pending <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.flaggedContent}</div>
            )}
             <Button variant="link" asChild className="text-xs text-muted-foreground px-0">
              <Link to="/admin/moderation">
                View Flagged <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Operators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">{stats.verifiedOperators}</div>
            )}
             <p className="text-xs text-muted-foreground">Total verified operators</p>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add Recent Activity Feed */}
      {/* TODO: Add Quick Actions */}

    </div>
  );
};

export default AdminOverview;
