import React, { useState } from 'react'; // Added useState
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building, List, Clock, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
// TODO: Import DateRangePicker when available/implemented
// TODO: Import Charting library components (e.g., Recharts)

// --- Fetch Functions ---

// Simple Counts
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

// --- Time Series Data (using RPC functions) ---
// Helper to get date range (e.g., last 30 days) - Replace with actual picker later
const getPastDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const fetchUserSignups = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase.rpc('get_user_signups_timeseries', {
    start_date: startDate,
    end_date: endDate,
  });
  if (error) {
    console.error("Error fetching user signups:", error);
    throw new Error(error.message);
  }
  return data || []; // Expects [{ day: string, count: number }]
};

const fetchOperatorGrowth = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase.rpc('get_operator_growth_timeseries', {
    start_date: startDate,
    end_date: endDate,
  });
   if (error) {
    console.error("Error fetching operator growth:", error);
    throw new Error(error.message);
  }
  return data || []; // Expects [{ day: string, count: number }]
};

// TODO: Add fetch functions for Listing Views, Top Listings etc. when tracking is implemented


const AdminAnalytics: React.FC = () => {
  // --- State for Date Range (Placeholder) ---
  // TODO: Replace with state from DateRangePicker
  const [dateRange, setDateRange] = useState({
    from: getPastDate(30),
    to: new Date().toISOString(),
  });


  // --- React Query Hooks ---
  // Simple Counts
  const { data: totalUsers, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useQuery({ queryKey: ['totalUsers'], queryFn: fetchTotalUsers });
  const { data: totalOperators, isLoading: isLoadingOperators, isError: isErrorOperators, error: errorOperators } = useQuery({ queryKey: ['totalOperators'], queryFn: fetchTotalOperators });
  const { data: totalListings, isLoading: isLoadingListings, isError: isErrorListings, error: errorListings } = useQuery({ queryKey: ['totalListings'], queryFn: fetchTotalListings });
  const { data: pendingOperators, isLoading: isLoadingPending, isError: isErrorPending, error: errorPending } = useQuery({ queryKey: ['pendingOperators'], queryFn: fetchPendingOperators });

  // Time Series Data
   const { data: userSignupsData, isLoading: isLoadingUserSignups, isError: isErrorUserSignups, error: errorUserSignups } = useQuery({
     queryKey: ['userSignups', dateRange.from, dateRange.to], // Include date range in key
     queryFn: () => fetchUserSignups(dateRange.from, dateRange.to),
     enabled: !!dateRange.from && !!dateRange.to, // Only run if dates are set
   });

   const { data: operatorGrowthData, isLoading: isLoadingOperatorGrowth, isError: isErrorOperatorGrowth, error: errorOperatorGrowth } = useQuery({
     queryKey: ['operatorGrowth', dateRange.from, dateRange.to], // Include date range in key
     queryFn: () => fetchOperatorGrowth(dateRange.from, dateRange.to),
     enabled: !!dateRange.from && !!dateRange.to, // Only run if dates are set
   });


  // Combined loading state for simplicity in placeholders where individual states aren't needed
  const isLoadingKPIs = isLoadingUsers || isLoadingOperators || isLoadingListings || isLoadingPending;
  // Separate loading for charts
  const isLoadingCharts = isLoadingUserSignups || isLoadingOperatorGrowth; // Add more as needed

  // TODO: Implement date range filtering logic - This will likely involve updating the dateRange state
  // and react-query will automatically refetch due to the queryKey change.

  // --- Render Logic ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Removed h1 title */}
        <h2 className="text-xl font-semibold text-muted-foreground">Analytics Overview</h2> {/* Use a less prominent title if needed */}
        {/* TODO: Add DateRangePicker component here */}
        <Skeleton className="h-10 w-full sm:w-64" /> {/* Placeholder for DateRangePicker */}
      </div>

      {/* KPI Cards */}
      {/* No need to wrap the grid itself in a card, keep individual cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingUsers ? <Skeleton className="h-8 w-1/2" /> : isErrorUsers ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <div className="text-2xl font-bold">{totalUsers}</div>}
             {isErrorUsers && <p className="text-xs text-destructive mt-1">{errorUsers?.message}</p>}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
             <Building className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingOperators ? <Skeleton className="h-8 w-1/2" /> : isErrorOperators ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <div className="text-2xl font-bold">{totalOperators}</div>}
             {isErrorOperators && <p className="text-xs text-destructive mt-1">{errorOperators?.message}</p>}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
             <List className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingListings ? <Skeleton className="h-8 w-1/2" /> : isErrorListings ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <div className="text-2xl font-bold">{totalListings}</div>}
             {isErrorListings && <p className="text-xs text-destructive mt-1">{errorListings?.message}</p>}
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Pending Operators</CardTitle>
             <Clock className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoadingPending ? <Skeleton className="h-8 w-1/2" /> : isErrorPending ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <div className="text-2xl font-bold">{pendingOperators}</div>}
             {isErrorPending && <p className="text-xs text-destructive mt-1">{errorPending?.message}</p>}
           </CardContent>
         </Card>
      </div>

      {/* Chart Placeholders - Already using Cards, just ensure consistency */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Chart Card 1 */}
        <Card className="border border-border/50"> {/* Add border for consistency */}
          <CardHeader>
            <CardTitle>User Signups Over Time</CardTitle>
            <CardDescription>New users registered in the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUserSignups ? (
              <Skeleton className="h-60 w-full" />
            ) : isErrorUserSignups ? (
               <div className="h-60 w-full flex flex-col items-center justify-center bg-destructive/10 dark:bg-destructive/20 rounded-md p-4">
                 <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                 <p className="text-destructive text-sm text-center">Error loading user signups:</p>
                 <p className="text-destructive text-xs text-center">{errorUserSignups?.message}</p>
               </div>
            ) : (
              // TODO: Replace with actual Chart component (e.g., Recharts LineChart)
              // Pass `userSignupsData` to the chart component
              <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">User Signups Chart (Data Ready)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example Chart Card 2 */}
        <Card className="border border-border/50"> {/* Add border for consistency */}
          <CardHeader>
            <CardTitle>Listing Views by Category</CardTitle>
            <CardDescription>Breakdown of views across different listing categories (Requires View Tracking).</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Keep skeleton for now as data source is not ready */}
            <Skeleton className="h-60 w-full" />
            {/* <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Listing Views Chart (Needs View Tracking)</p>
              </div> */}
          </CardContent>
        </Card>

        {/* Example Chart Card 3 */}
        <Card className="border border-border/50"> {/* Add border for consistency */}
          <CardHeader>
            <CardTitle>Operator Growth</CardTitle>
            <CardDescription>Verified operators added in the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoadingOperatorGrowth ? (
              <Skeleton className="h-60 w-full" />
            ) : isErrorOperatorGrowth ? (
               <div className="h-60 w-full flex flex-col items-center justify-center bg-destructive/10 dark:bg-destructive/20 rounded-md p-4">
                 <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                 <p className="text-destructive text-sm text-center">Error loading operator growth:</p>
                 <p className="text-destructive text-xs text-center">{errorOperatorGrowth?.message}</p>
               </div>
            ) : (
              // TODO: Replace with actual Chart component (e.g., Recharts LineChart)
              // Pass `operatorGrowthData` to the chart component
              <div className="h-60 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Operator Growth Chart (Data Ready)</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add Data Tables for Top Listings/Operators */}
       <Card className="border border-border/50"> {/* Add border for consistency */}
          <CardHeader>
            <CardTitle>Top Viewed Listings</CardTitle>
          </CardHeader>
          <CardContent>
             {/* Keep skeleton for now as data source is not ready */}
             <Skeleton className="h-40 w-full" />
            {/* <div className="h-40 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-muted-foreground">Top Listings Table (Needs View Tracking)</p>
              </div> */}
          </CardContent>
        </Card>

    </div> // Closing div for the main component wrapper
  );
};

export default AdminAnalytics;
