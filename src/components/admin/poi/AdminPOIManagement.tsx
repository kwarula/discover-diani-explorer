import React, { useState, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from './DataTable'; // Import DataTable
import { createColumns } from './columns'; // Import columns factory
import type { POI, POICategoryType } from './types'; // Import POI type
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
// TODO: Import Dialog/Sheet for Add/Edit/View
// TODO: Import Add/Edit Form component

// Fetch function using Supabase
const fetchPOIs = async (): Promise<POI[]> => {
  const { data, error } = await supabase
    .from('points_of_interest')
    .select('id, name, category, featured, created_at, updated_at') // Select columns defined in POI type
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error (POIs):", error);
    throw new Error(error.message || 'Failed to fetch Points of Interest');
  }
  // Cast needed because select doesn't guarantee all fields match the Pick exactly,
  // though in this case they should.
  return (data || []) as POI[];
};

const AdminPOIManagement: React.FC = () => {
  const { data: pois = [], isLoading, isError, error } = useQuery<POI[], Error>({
    queryKey: ['adminPOIs'],
    queryFn: fetchPOIs, // Use actual fetch function
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // TODO: Add state for dialogs/sheets (Add, Edit, Delete, View)
  // TODO: Add mutations for Add, Update, Delete POI

  // --- Action Handlers (Placeholders) ---
  const handleAddPOI = () => {
    toast.info("Add POI action not implemented.");
    // TODO: Open Add POI Sheet/Dialog
  };
  const handleEditPOI = (poi: POI) => {
    toast.info(`Edit POI action for ${poi.name} not implemented.`);
     // TODO: Open Edit POI Sheet/Dialog with poi data
  };
  const handleDeletePOI = (poi: POI) => {
     toast.info(`Delete POI action for ${poi.name} not implemented.`);
     // TODO: Open Delete Confirmation Dialog
  };
   const handleViewPOI = (poi: POI) => {
     toast.info(`View POI action for ${poi.name} not implemented.`);
     // TODO: Open View Details Sheet/Dialog
  };

  // --- Table Setup ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Create columns using the factory, passing action handlers
  const memoizedColumns = useMemo<ColumnDef<POI>[]>(
    () => createColumns({
        onViewDetails: handleViewPOI,
        onEdit: handleEditPOI,
        onDelete: handleDeletePOI,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Handlers have stable refs
  );

   const table = useReactTable({
    data: pois,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, rowSelection },
    initialState: { pagination: { pageSize: 10 } },
  });

  // Define POI Categories for the filter dropdown
  const poiCategories: POICategoryType[] = [
    'historical_site', 'natural_feature', 'cultural_site',
    'conservation_site', 'viewpoint', 'beach_area'
  ];

  return (
    <div className="space-y-6">
      {/* Removed h1 title */}

      <Card className="border border-border/50"> {/* Wrap content in a Card */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"> {/* Header with title and button */}
          <CardTitle>Manage Points of Interest</CardTitle>
          <Button onClick={handleAddPOI} size="sm"> {/* Moved Add button here */}
            <PlusCircle className="mr-2 h-4 w-4" /> Add POI
          </Button>
        </CardHeader>
        <CardContent className="space-y-4"> {/* Add spacing inside card content */}
          {/* Filters */}
          <div className="flex items-center gap-2"> {/* Removed py-4 */}
         {/* Category Filter */}
         <Select
           value={(isLoading || isError) ? '' : (table.getColumn('category')?.getFilterValue() as string) ?? 'all'}
           onValueChange={(value) => table.getColumn('category')?.setFilterValue(value === 'all' ? '' : value)}
           disabled={isLoading || isError}
         >
           <SelectTrigger className="w-[200px]"> {/* Wider trigger */}
             <SelectValue placeholder="Filter by Category" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Categories</SelectItem>
             {poiCategories.map(category => (
               <SelectItem key={category} value={category}>
                 {/* Format category name for display */}
                 {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>
         {/* Featured Filter */}
          <Select
            value={(isLoading || isError) ? 'all' : (table.getColumn('featured')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => table.getColumn('featured')?.setFilterValue(value === 'all' ? undefined : value)}
            disabled={isLoading || isError}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
           {/* Keep skeleton filters for loading state - No need to repeat filters here */}
          <div className="rounded-md border">
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
          </div>
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading POIs</AlertTitle>
          <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
        </Alert>
      ) : (
         <DataTable columns={memoizedColumns} table={table} />
      )}
        </CardContent>
      </Card>

      {/* TODO: Add Dialogs/Sheets for Add/Edit/View/Delete (remain outside card) */}

    </div>
  );
};

export default AdminPOIManagement;
