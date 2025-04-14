import React, { useState, useMemo } from 'react'; // Import useMemo
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
} from "@tanstack/react-table"; // Import table hooks/types
import { DataTable } from './DataTable'; // Import the DataTable component
import { columns } from './columns'; // Import columns definition
import type { Operator, OperatorStatus } from './types'; // Import Operator type from types.ts
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error display
import { AlertTriangle } from 'lucide-react';
import { toast } from "sonner"; // For notifications
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger, // We might not use Trigger directly here
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"; // Import Sheet components
import { Label } from "@/components/ui/label"; // For displaying details
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Import Button
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select for filtering
import { PlusCircle } from 'lucide-react'; // Icon for Add button
import AddOperatorForm from './AddOperatorForm'; // Import the new form component (will create next)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

// Operator type is now defined and exported from ./types.ts

// Helper functions (copied from columns.tsx - consider moving to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch (e) {
    return 'Invalid Date';
  }
};
const getStatusBadgeVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
   switch (status as OperatorStatus) { // Cast to known statuses
    case 'verified': return 'default';
    case 'pending_verification': return 'secondary';
    case 'rejected': case 'suspended': return 'destructive';
    default: return 'outline';
  }
};
const formatStatusText = (status: string | null): string => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Function to fetch operators from Supabase
const fetchOperators = async (): Promise<Operator[]> => {
  const { data, error } = await supabase
    .from('operators')
    .select('id, business_name, contact_person_name, contact_email, status, created_at')
    .order('created_at', { ascending: false }); // Fetch newest first

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(error.message || 'Failed to fetch operators');
  }

  // Ensure data conforms to Operator type, handling potential nulls if necessary
  // The Pick in types.ts should align with the select statement
  return data || [];
};

const AdminOperatorManagement: React.FC = () => {
  const { data: operators = [], isLoading, isError, error } = useQuery<Operator[], Error>({
    queryKey: ['adminOperators'],
    queryFn: fetchOperators,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // State for managing the confirmation dialog
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    operatorId: string | null;
    operatorName: string | null;
    actionType: 'approve' | 'reject' | 'suspend' | 'reactivate' | null; // To reuse dialog later
  }>({ isOpen: false, operatorId: null, operatorName: null, actionType: null });

  // State for rejection reason input
  const [rejectionReason, setRejectionReason] = useState('');

  // State for View Details Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false); // State for Add Operator sheet


  // --- Mutations ---

  // Mutation to update operator status
  const updateOperatorStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OperatorStatus | string }) => {
      const { error } = await supabase
        .from('operators')
        .update({ status: status })
        .eq('id', id);

      if (error) {
        throw new Error(error.message || `Failed to update status for operator ${id}`);
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`Operator status updated to ${variables.status.replace(/_/g, ' ')}.`);
      // Invalidate the query cache to refetch the operators list
      queryClient.invalidateQueries({ queryKey: ['adminOperators'] });
    },
    onError: (error) => {
      console.error("Update status error:", error);
      toast.error(`Failed to update operator status: ${error.message}`);
    },
     onSettled: () => {
      // Close the dialog regardless of success or error
      setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
    }
  });


  // --- Action Handlers ---

  // Function to open the confirmation dialog
  const openConfirmationDialog = (operator: Operator, action: 'approve' | 'reject' | 'suspend' | 'reactivate') => {
    setDialogState({
      isOpen: true,
      operatorId: operator.id,
      operatorName: operator.business_name,
      actionType: action,
    });
    // Reset rejection reason when opening any dialog
    setRejectionReason('');
  };

   // Function to open the View Details sheet
  const openViewDetailsSheet = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsSheetOpen(true);
  };

  // Function to handle the confirmed action
  const handleConfirmAction = () => {
    if (!dialogState.operatorId || !dialogState.actionType) return;

    let newStatus: OperatorStatus | string | null = null;
    // TODO: Potentially send rejectionReason to backend/notification service
    console.log("Rejection Reason (if any):", rejectionReason);

    switch (dialogState.actionType) {
        case 'approve': newStatus = 'verified'; break;
        case 'reject': newStatus = 'rejected'; break;
        case 'suspend': newStatus = 'suspended'; break;
        case 'reactivate': newStatus = 'verified'; break; // Reactivate sets back to verified
    }

    if (newStatus) {
        updateOperatorStatusMutation.mutate({ id: dialogState.operatorId, status: newStatus });
    } else {
         // Close dialog if action type is not handled yet
         setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
    }
  };


  // --- Table State and Instance ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Memoize columns definition with handlers
  const memoizedColumns = useMemo(
    () => columns(openConfirmationDialog, openViewDetailsSheet),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Handlers have stable references
  );

  // Create table instance
   const operatorsTable = useReactTable({
    data: operators, // Use fetched data
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
     initialState: {
      pagination: {
        pageSize: 10, // Default page size
      },
    },
  });


  return (
    <div className="space-y-6">
      {/* Removed h1 title */}

      <Card className="border border-border/50"> {/* Wrap content in a Card */}
        <CardHeader>
          <CardTitle>Manage Operators</CardTitle>
          {/* Optional: Add description here */}
        </CardHeader>
        <CardContent className="space-y-4"> {/* Add spacing inside card content */}
          {/* Filters and Add Button */}
          <div className="flex justify-between items-center gap-2"> {/* Removed py-4 */}
         {/* Filter Controls */}
         <div className="flex items-center gap-2">
            {/* Business Name Filter is handled inside DataTable */}
            {/* Status Filter */}
            <Select
            // Get the current filter value from the table state
            value={(isLoading || isError) ? '' : (operatorsTable.getColumn('status')?.getFilterValue() as string) ?? 'all'}
            onValueChange={(value) => {
              // Set filter value, 'all' means no filter
              operatorsTable.getColumn('status')?.setFilterValue(value === 'all' ? '' : value);
            }}
            disabled={isLoading || isError}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending_verification">Pending Verification</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
            {/* TODO: Add button to clear all filters */}
         </div>
          {/* Add Operator Button */}
          <Button onClick={() => setIsAddSheetOpen(true)}>
             <PlusCircle className="mr-2 h-4 w-4" /> Add Operator
          </Button>
        </div>

      {isLoading && (
        // Skeleton Loading State
        <div className="space-y-4">
          <div className="flex items-center py-4 gap-2">
             <Skeleton className="h-10 w-[250px]" /> {/* Name Filter placeholder */}
             <Skeleton className="h-10 w-[180px]" /> {/* Status Filter placeholder */}
          </div>
          <div className="rounded-md border">
            {/* Simulate table rows */}
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4 border-b"><Skeleton className="h-5 w-full" /></div>
            <div className="p-4"><Skeleton className="h-5 w-full" /></div>
          </div>
           <div className="flex items-center justify-between space-x-2 py-4">
             <Skeleton className="h-8 w-[150px]" /> {/* Selection count placeholder */}
             <div className="space-x-2">
                <Skeleton className="h-9 w-20" /> {/* Prev button placeholder */}
                <Skeleton className="h-9 w-20" /> {/* Next button placeholder */}
             </div>
           </div>
        </div>
      )}

      {isError && (
        // Error State
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Operators</AlertTitle>
            <AlertDescription>
              {error?.message || "An unexpected error occurred."}
            </AlertDescription>
          </Alert>
      )}

      {!isLoading && !isError && (
        // Data Loaded State - Pass table instance
        <DataTable columns={memoizedColumns} table={operatorsTable} />
      )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog (remain outside the card) */}
      <AlertDialog
        open={dialogState.isOpen && dialogState.actionType === 'approve'}
        onOpenChange={(open) => {
          if (!open) {
            setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Operator?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve the operator "{dialogState.operatorName || 'this operator'}"? Their status will be set to "Verified".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateOperatorStatusMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={updateOperatorStatusMutation.isPending}
              className="bg-green-600 hover:bg-green-700" // Example styling
            >
              {updateOperatorStatusMutation.isPending ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
         open={dialogState.isOpen && dialogState.actionType === 'reject'}
         onOpenChange={(open) => {
           if (!open) {
             setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
             setRejectionReason(''); // Clear reason on close
           }
         }}
      >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Operator?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject the operator "{dialogState.operatorName || 'this operator'}"? Their status will be set to "Rejected".
                You can optionally provide a reason below (this might be sent to the operator).
              </AlertDialogDescription>
            </AlertDialogHeader>
            {/* Rejection Reason Input */}
            <div className="py-2">
                <label htmlFor="rejectionReason" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Reason for Rejection (Optional)
                </label>
                <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Missing verification documents, invalid business type..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2" // Added padding
                    rows={3}
                    disabled={updateOperatorStatusMutation.isPending}
                />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updateOperatorStatusMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                disabled={updateOperatorStatusMutation.isPending}
                className="bg-red-600 hover:bg-red-700" // Destructive styling
              >
                {updateOperatorStatusMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

       {/* Suspend Confirmation Dialog */}
      <AlertDialog
         open={dialogState.isOpen && dialogState.actionType === 'suspend'}
         onOpenChange={(open) => {
           if (!open) {
             setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
           }
         }}
      >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suspend Operator?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to suspend the operator "{dialogState.operatorName || 'this operator'}"? Their account and listings may become inactive. Their status will be set to "Suspended".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updateOperatorStatusMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                disabled={updateOperatorStatusMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700" // Warning styling
              >
                {updateOperatorStatusMutation.isPending ? 'Suspending...' : 'Confirm Suspend'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

       {/* Reactivate Confirmation Dialog */}
      <AlertDialog
         open={dialogState.isOpen && dialogState.actionType === 'reactivate'}
         onOpenChange={(open) => {
           if (!open) {
             setDialogState({ isOpen: false, operatorId: null, operatorName: null, actionType: null });
           }
         }}
      >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reactivate Operator?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reactivate the operator "{dialogState.operatorName || 'this operator'}"? Their status will be set back to "Verified".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updateOperatorStatusMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmAction}
                disabled={updateOperatorStatusMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700" // Info styling
              >
                {updateOperatorStatusMutation.isPending ? 'Reactivating...' : 'Confirm Reactivate'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      {/* View Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto"> {/* Adjust width and add scroll */}
          <SheetHeader>
            <SheetTitle>Operator Details</SheetTitle>
            <SheetDescription>
              Viewing details for "{selectedOperator?.business_name || 'N/A'}".
              {/* TODO: Add Edit button here? */}
            </SheetDescription>
          </SheetHeader>
          {selectedOperator ? (
            <div className="grid gap-4 py-4">
               {/* Display Operator Details */}
               {/* Use Label and simple text divs for read-only view */}
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-id" className="text-right col-span-1">ID</Label>
                 <div id="details-id" className="col-span-3 text-sm text-muted-foreground break-all">{selectedOperator.id}</div>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-business" className="text-right col-span-1">Business Name</Label>
                 <div id="details-business" className="col-span-3">{selectedOperator.business_name || 'N/A'}</div>
               </div>
                <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-contact-name" className="text-right col-span-1">Contact Name</Label>
                 <div id="details-contact-name" className="col-span-3">{selectedOperator.contact_person_name || 'N/A'}</div>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-contact-email" className="text-right col-span-1">Contact Email</Label>
                 <div id="details-contact-email" className="col-span-3">{selectedOperator.contact_email || 'N/A'}</div>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-status" className="text-right col-span-1">Status</Label>
                 <div id="details-status" className="col-span-3">
                    <Badge variant={getStatusBadgeVariant(selectedOperator.status)}>
                        {formatStatusText(selectedOperator.status)}
                    </Badge>
                 </div>
               </div>
                <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="details-registered" className="text-right col-span-1">Registered</Label>
                 <div id="details-registered" className="col-span-3">{formatDate(selectedOperator.created_at)}</div>
               </div>
               {/* TODO: Fetch and display more details if needed (address, docs, gallery) */}
               {/* Example: <Separator className="my-4" /> */}
               {/* Example: <p>Verification Documents:</p> ... */}
            </div>
          ) : (
             <p className="text-muted-foreground py-4">No operator selected.</p>
          )}
           <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
        </SheetContent>
      </Sheet>

       {/* Add Operator Sheet */}
       <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Operator</SheetTitle>
            <SheetDescription>
              Enter the details for the new operator. An invitation email will be sent to the specified user email address.
            </SheetDescription>
          </SheetHeader>
          {/* Render the form component here */}
          <AddOperatorForm 
             onSuccess={() => {
               setIsAddSheetOpen(false); // Close sheet on success
               queryClient.invalidateQueries({ queryKey: ['adminOperators'] }); // Refetch list
             }} 
             onCancel={() => setIsAddSheetOpen(false)} // Add cancel handler
           />
          {/* Footer might not be needed if form has its own submit/cancel */}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminOperatorManagement;
