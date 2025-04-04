import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building, List, Clock } from 'lucide-react'; // Icons for KPI cards
// TODO: Import DateRangePicker when available/implemented
// TODO: Import Charting library components (e.g., Recharts)

// Fetch functions for simple counts
const fetchTotalUsers = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
};

const fetchTotalOperators = async () => {
  const { count, error } = await supabase
    .from('operators')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
};

const fetchTotalListings = async () => {
  const { count, error } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
};

const fetchPendingOperators = async () => {
  const { count, error } = await supabase
    .from('operators')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_verification');
  if (error) throw new Error(error.message);
  return count ?? 0;
};


const AdminAnalytics: React.FC = () => {
  // Fetch data using react-query
  const { data: totalUsers, isLoading: isLoadingUsers } = useQuery({ queryKey: ['totalUsers'], queryFn: fetchTotalUsers });
  const { data: totalOperators, isLoading: isLoadingOperators } = useQuery({ queryKey: ['totalOperators'], queryFn: fetchTotalOperators });
  const { data: totalListings, isLoading: isLoadingListings } = useQuery({ queryKey: ['totalListings'], queryFn: fetchTotalListings });
  const { data: pendingOperators, isLoading: isLoadingPending } = useQuery({ queryKey: ['pendingOperators'], queryFn: fetchPendingOperators });

  const isLoading = isLoadingUsers || isLoadingOperators || isLoadingListings || isLoadingPending;

  // TODO: Implement date range filtering logic

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Analytics Overview</h1>
        {/* TODO: Add DateRangePicker component here */}
        <Skeleton className="h-10 w-full sm:w-64" /> {/* Placeholder for DateRangePicker */}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingUsers ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalUsers}</div>}
             {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
             <Building className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingOperators ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalOperators}</div>}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
             <List className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingListings ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{totalListings}</div>}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Pending Operators</CardTitle>
             <Clock className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingPending ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{pendingOperators}</div>}
           </CardContent>
         </Card>
      </div>


      {/* Chart Placeholders */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Chart Card 1 */}
        <Card>
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
            <CardDescription>New users registered per day/week/month.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              // TODO: Replace with actual Chart component
              <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example Chart Card 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Views by Category</CardTitle>
            <CardDescription>Breakdown of views across different listing categories.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              // TODO: Replace with actual Chart component (e.g., Pie or Bar chart)
              <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example Chart Card 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Operator Growth</CardTitle>
            <CardDescription>Number of verified operators over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              // TODO: Replace with actual Chart component
              <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Chart Placeholder</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add Data Tables for Top Listings/Operators */}
       <Card>
          <CardHeader>
            <CardTitle>Top Viewed Listings</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              // TODO: Replace with actual Table component
              <div className="h-40 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Data Table Placeholder</p>
              </div>
            )}
          </CardContent>
        </Card>

    </div>
  );
};

export default AdminAnalytics;
