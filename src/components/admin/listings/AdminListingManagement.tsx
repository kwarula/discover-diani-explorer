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
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from './DataTable'; // Assuming DataTable exists and is adapted
import { columns } from './columns'; // Import columns definition
import type { Listing } from './types'; // Import Listing type from types.ts
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input'; // For Edit Sheet
import { Textarea } from '@/components/ui/textarea'; // For Edit Sheet
import type { Database } from '@/types/database'; // Import Database type

// Listing type is now defined and exported from ./types.ts

// Helper functions (copied - consider moving to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};
const getStatusBadgeVariant = (status: Listing['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'approved': case 'featured': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': case 'flagged': return 'destructive';
    default: return 'outline';
  }
};
const formatStatusText = (status: Listing['status']): string => {
  if (!status) return 'Unknown';
  // Format action types from dialogState as well if needed
  if (typeof status !== 'string') return 'Unknown Action';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Function to fetch listings from Supabase
// TODO: Use RPC function to join with operators/profiles table to get operator_name/user_name efficiently.
const fetchListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, category, status, created_at, description') // Added description
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error (listings):", error);
    throw new Error(error.message || 'Failed to fetch listings');
  }

  // Map data to Listing type
  return (data || []).map(item => ({
      ...item,
      submitted_at: item.created_at, // Map created_at to submitted_at
      operator_name: 'Operator Name Placeholder', // *** PLACEHOLDER ***
  })) as Listing[]; // Cast needed as select doesn't guarantee all Listing fields
};

// Define possible statuses for filtering/actions
type ListingStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'featured' | 'unpublished'; // Add unpublished?

const AdminListingManagement: React.FC = () => {
  const { data: listings = [], isLoading, isError, error } = useQuery<Listing[], Error>({
    queryKey: ['adminListings'],
    queryFn: fetchListings,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // State for dialogs
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    listingId: string | null;
    listingTitle: string | null;
    actionType: 'approve' | 'reject' | 'feature' | 'unfeature' | 'unpublish' | 'republish' | null;
  }>({ isOpen: false, listingId: null, listingTitle: null, actionType: null });

  // State for View/Edit Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  // TODO: Add state for form fields if implementing edit

  // --- Mutations ---
  // TODO: Add mutation for full listing update (for edit sheet)

  const updateListingStatusMutation = useMutation({
    mutationFn: async ({ id, status, featured }: { id: string; status?: ListingStatus | string, featured?: boolean }) => {
       let updateData: Partial<Database['public']['Tables']['listings']['Update']> = {};
       if (status !== undefined) updateData.status = status;
       if (featured !== undefined) updateData.featured = featured;

       if (Object.keys(updateData).length === 0) {
           throw new Error("No update data provided.");
       }

      // Assert type for local TS check, assuming columns exist in deployed DB
      const { error } = await supabase
        .from('listings')
        .update(updateData as Partial<Database['public']['Tables']['listings']['Row']>)
        .eq('id', id);

      if (error) {
        throw new Error(error.message || `Failed to update listing ${id}`);
      }
    },
    onSuccess: (_, variables) => {
      let message = "Listing updated.";
      if (variables.status) message = `Listing status updated to ${formatStatusText(variables.status)}.`;
      if (variables.featured !== undefined) message = `Listing ${variables.featured ? 'featured' : 'unfeatured'}.`;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
    },
    onError: (error) => {
      toast.error(`Failed to update listing: ${error.message}`);
    },
    onSettled: () => {
      setDialogState({ isOpen: false, listingId: null, listingTitle: null, actionType: null });
    }
  });

  // --- Action Handlers ---
  const openConfirmationDialog = (listing: Listing, action: typeof dialogState.actionType) => {
    setDialogState({ isOpen: true, listingId: listing.id, listingTitle: listing.title, actionType: action });
  };

  const openViewEditSheet = (listing: Listing) => {
    // TODO: Fetch full listing details if needed for editing
    setSelectedListing(listing);
    setIsSheetOpen(true);
  };

  const handleConfirmAction = () => {
    if (!dialogState.listingId || !dialogState.actionType) return;

    let newStatus: ListingStatus | string | undefined = undefined;
    let newFeatured: boolean | undefined = undefined;

    switch (dialogState.actionType) {
        case 'approve': newStatus = 'approved'; break;
        case 'reject': newStatus = 'rejected'; break;
        case 'feature': newFeatured = true; break; // Keep status potentially, just toggle feature
        case 'unfeature': newFeatured = false; break;
        case 'unpublish': newStatus = 'unpublished'; newFeatured = false; break; // Example: unpublishing also unfeatures
        case 'republish': newStatus = 'approved'; break; // Republish sets back to approved
    }

     updateListingStatusMutation.mutate({
        id: dialogState.listingId,
        ...(newStatus !== undefined && { status: newStatus }),
        ...(newFeatured !== undefined && { featured: newFeatured }),
     });
  };

   // --- Table Setup ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const memoizedColumns = useMemo(
    () => columns(openConfirmationDialog, openViewEditSheet),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

   const listingsTable = useReactTable({
    data: listings,
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Listing Management</h1>

      {/* Filters */}
       <div className="flex items-center py-4 gap-2">
          {/* Category Filter */}
          <Select
            value={(isLoading || isError) ? '' : (listingsTable.getColumn('category')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => listingsTable.getColumn('category')?.setFilterValue(value === 'all' ? '' : value)}
            disabled={isLoading || isError}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {/* Add likely categories based on project context */}
              <SelectItem value="Accommodation">Accommodation</SelectItem>
              <SelectItem value="Activity">Activity</SelectItem>
              <SelectItem value="Restaurant">Restaurant</SelectItem>
              <SelectItem value="Watersports">Watersports</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Shop">Shop</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
           {/* Status Filter */}
           <Select
             value={(isLoading || isError) ? '' : (listingsTable.getColumn('status')?.getFilterValue() as string) ?? 'all'}
             onValueChange={(value) => listingsTable.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}
             disabled={isLoading || isError}
           >
             <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="Filter by Status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Statuses</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="approved">Approved</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
               <SelectItem value="featured">Featured</SelectItem>
               <SelectItem value="flagged">Flagged</SelectItem>
               <SelectItem value="unpublished">Unpublished</SelectItem>
             </SelectContent>
           </Select>
        </div>

      {/* Table */}
      {isLoading ? (
         <div className="space-y-4">
           {/* Keep skeleton filters for loading state - No need to repeat filters here */}
           <div className="rounded-md border">
            {/* Simulate table rows */}
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4"><Skeleton className="h-5 w-full" /></div>
          </div>
           <div className="flex items-center justify-between space-x-2 py-4">
             <Skeleton className="h-8 w-[150px]" />
             <div className="space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
             </div>
           </div>
        </div>
      ) : isError ? (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Listings</AlertTitle>
            <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
          </Alert>
      ) : (
        <DataTable columns={memoizedColumns} table={listingsTable} />
      )}

      {/* Action Dialogs */}
      <AlertDialog
        open={dialogState.isOpen && ['approve', 'reject', 'feature', 'unfeature', 'unpublish', 'republish'].includes(dialogState.actionType || '')}
        onOpenChange={(open) => { if (!open) setDialogState({ isOpen: false, listingId: null, listingTitle: null, actionType: null }); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action: {formatStatusText(dialogState.actionType)}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {dialogState.actionType} the listing "{dialogState.listingTitle || 'this listing'}"?
              {/* Add specific descriptions per action if needed */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateListingStatusMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={updateListingStatusMutation.isPending}
              // Add dynamic styling based on actionType if desired
            >
              {updateListingStatusMutation.isPending ? 'Processing...' : `Confirm ${formatStatusText(dialogState.actionType)}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* View/Edit Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl w-[90vw] overflow-y-auto"> {/* Wider sheet */}
          <SheetHeader>
            <SheetTitle>Listing Details</SheetTitle>
            <SheetDescription>
              View or edit details for "{selectedListing?.title || 'N/A'}".
            </SheetDescription>
          </SheetHeader>
          {selectedListing ? (
            <div className="space-y-4 py-4">
              {/* TODO: Replace with Shadcn Form components for editing */}
              <p>ID: {selectedListing.id}</p>
              <p>Title: {selectedListing.title}</p>
              <p>Operator: {selectedListing.operator_name}</p>
              <p>Category: {selectedListing.category}</p>
              <p>Status: <Badge variant={getStatusBadgeVariant(selectedListing.status)}>{formatStatusText(selectedListing.status)}</Badge></p>
              <p>Submitted: {formatDate(selectedListing.submitted_at)}</p>
              {/* Add more fields: description, price, location, images etc. */}
               <Textarea defaultValue={selectedListing.description || ''} placeholder="Description..." rows={5} />
            </div>
          ) : (
             <p className="text-muted-foreground py-4">No listing selected.</p>
          )}
           <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
               {/* TODO: Add Save button for edit functionality */}
               <Button type="submit" disabled>Save Changes</Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminListingManagement;
