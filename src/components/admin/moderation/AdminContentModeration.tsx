import React, { useState, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from './DataTable';
import { createColumns } from './columns';
import { FlaggedContent } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import ModerationConfirmDialog from './ModerationConfirmDialog';
import { fetchFlaggedContent, updateFlagStatus, removeContent } from './moderationService';

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
      await updateFlagStatus(id, status);
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

  // Mutation for removing the actual content (Review, Comment, etc.)
  const removeContentMutation = useMutation({
    mutationFn: async ({ flagId, contentId, contentType }: { flagId: string, contentId: string, contentType: string }) => {
      await removeContent(flagId, contentId, contentType);
    },
    onSuccess: () => {
      toast.success(`Content removed and flag resolved.`);
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

  // Placeholder handlers for user actions
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

  // Call the columns function and memoize the result
  const memoizedColumns = useMemo(() => {
    return createColumns(openConfirmationDialog, handleWarnUser, handleSuspendUser);
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
          <AlertTitle>Error Loading Flagged Content</AlertTitle>
          <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
        </Alert>
      ) : (
        <DataTable columns={memoizedColumns} table={moderationTable} />
      )}

      {/* Action Dialogs */}
      <ModerationConfirmDialog
        isOpen={dialogState.isOpen && ['approve', 'remove'].includes(dialogState.actionType || '')}
        actionType={dialogState.actionType}
        itemSnippet={dialogState.itemSnippet}
        isProcessing={updateFlagStatusMutation.isPending || removeContentMutation.isPending}
        onClose={() => setDialogState({ isOpen: false, itemId: null, itemSnippet: null, actionType: null })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default AdminContentModeration;
