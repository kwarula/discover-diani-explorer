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
import { DataTable } from './DataTable'; 
import { columns } from './columns'; 
import type { FlaggedContent } from './types'; 
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

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};
const formatStatusText = (status: string | null): string => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Function to fetch flagged content from Supabase
const fetchFlaggedContent = async (): Promise<FlaggedContent[]> => {
  // Use type assertion to handle flagged_content table
  const { data, error } = await supabase
    .from('flagged_content' as any)
    .select('*')
    .order('reported_at', { ascending: false });

  if (error) {
    console.error("Supabase fetch error (flagged_content):", error);
    throw new Error(error.message || 'Failed to fetch flagged content');
  }
  
  return (data || []) as FlaggedContent[];
};

// Define possible statuses for actions/filtering
type ModerationStatus = 'Pending' | 'Resolved';
type ModerationAction = 'approve' | 'remove'; 

const AdminContentModeration: React.FC = () => {
  const { data: flaggedItems = [], isLoading, isError, error } = useQuery<FlaggedContent[], Error>({
    queryKey: ['adminFlaggedContent'],
    queryFn: fetchFlaggedContent,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // State for dialogs
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    itemId: string | null; 
    itemSnippet: string | null;
    actionType: ModerationAction | null;
  }>({ isOpen: false, itemId: null, itemSnippet: null, actionType: null });

  // --- Mutations ---

  // Mutation to update the status of a flagged item (e.g., set to 'Resolved')
  const updateFlagStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ModerationStatus }) => {
      const { error } = await supabase
        .from('flagged_content' as any)
        .update({ status: status })
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      toast.success(`Flagged item marked as ${variables.status}.`);
      queryClient.invalidateQueries({ queryKey: ['adminFlaggedContent'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update flag status: ${error.message}`);
    },
    onSettled: () => {
      setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null });
    }
  });

  // Placeholder mutation for removing the actual content (Review, Comment, etc.)
  const removeContentMutation = useMutation({
     mutationFn: async ({ flagId, contentId, contentType }: { flagId: string, contentId: string, contentType: string }) => {
        console.warn(`Placeholder: Removing content type '${contentType}' (ID: ${contentId}). Requires specific implementation.`);

        // Update the flag status to 'Resolved'
        const { error: flagError } = await supabase
          .from('flagged_content' as any)
          .update({ status: 'Resolved' })
          .eq('id', flagId);
        
        if (flagError) throw new Error(`Failed to update flag status after content removal: ${flagError.message}`);

        await new Promise(res => setTimeout(res, 500)); // Simulate delay
     },
     onSuccess: () => {
       toast.success(`Content removed and flag resolved (Placeholder).`);
       queryClient.invalidateQueries({ queryKey: ['adminFlaggedContent'] });
     },
     onError: (error: Error) => {
       toast.error(`Failed to remove content: ${error.message}`);
     },
     onSettled: () => {
       setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null });
     }
  });


  // --- Action Handlers ---
  const openConfirmationDialog = (item: FlaggedContent, action: ModerationAction) => {
    setDialogState({
        isOpen: true,
        itemId: item.id,
        itemSnippet: item.content_snippet,
        actionType: action
    });
  };

  // Placeholder handlers for user actions (would likely navigate or open user dialog)
  const handleWarnUser = (userId: string | null) => {
      if (!userId) return;
      console.log("Warn User:", userId);
      toast.info("Warn User action not implemented.");
  };
  
  const handleSuspendUser = (userId: string | null) => {
      if (!userId) return;
      console.log("Suspend User:", userId);
      toast.info("Suspend User action not implemented.");
  };

  const handleConfirmAction = () => {
    if (!dialogState.itemId || !dialogState.actionType) return;

    const itemToActOn = flaggedItems.find(item => item.id === dialogState.itemId);
    if (!itemToActOn) {
        toast.error("Could not find the item to moderate.");
        setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null });
        return;
    }

    switch (dialogState.actionType) {
        case 'approve':
            updateFlagStatusMutation.mutate({ id: dialogState.itemId, status: 'Resolved' });
            break;
        case 'remove':
            // This is the placeholder - requires real implementation
            removeContentMutation.mutate({
                flagId: itemToActOn.id,
                contentId: itemToActOn.content_id,
                contentType: itemToActOn.content_type
            });
            break;
        default:
             setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null });
    }
  };

  // --- Table Setup ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Pass the handlers to columns
  const memoizedColumns = useMemo(() => {
    return columns(openConfirmationDialog, handleWarnUser, handleSuspendUser);
  }, []);

  const moderationTable = useReactTable({
    data: flaggedItems,
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
      <h1 className="text-2xl font-semibold">Content Moderation</h1>

      {/* Filters */}
      <div className="flex items-center py-4 gap-2">
        <Skeleton className="h-10 w-[180px]" /> {/* Type Filter placeholder */}
        <Skeleton className="h-10 w-[180px]" /> {/* Status Filter placeholder */}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {/* Keep skeleton filters for loading state */}
          <div className="flex items-center py-4 gap-2">
            <Skeleton className="h-10 w-[180px]" /> {/* Type Filter placeholder */}
            <Skeleton className="h-10 w-[180px]" /> {/* Status Filter placeholder */}
          </div>
          <div className="rounded-md border">
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
          <AlertTitle>Error Loading Flagged Content</AlertTitle>
          <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
        </Alert>
      ) : (
        <DataTable data={flaggedItems} columns={memoizedColumns} />
      )}

      {/* Action Dialogs */}
      <AlertDialog
        open={dialogState.isOpen && ['approve', 'remove'].includes(dialogState.actionType || '')}
        onOpenChange={(open) => { if (!open) setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null }); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action: {formatStatusText(dialogState.actionType)}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState.actionType === 'approve' && `Are you sure you want to approve this content (dismiss the flag)? The content snippet starts: "${dialogState.itemSnippet?.substring(0, 50)}..."`}
              {dialogState.actionType === 'remove' && <span className="text-red-600 font-semibold">Are you sure you want to remove this content permanently? This cannot be undone.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateFlagStatusMutation.isPending || removeContentMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={updateFlagStatusMutation.isPending || removeContentMutation.isPending}
              className={dialogState.actionType === 'remove' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {updateFlagStatusMutation.isPending || removeContentMutation.isPending ? 'Processing...' : `Confirm ${formatStatusText(dialogState.actionType)}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContentModeration;
