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
// Use the correct User type and related types
import type { User, UserRole, UserStatus } from './types';
// Import Database and Tables helper
import { Database, Tables } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Correct import path for Card

// Define Profile type locally using Tables helper
type Profile = Tables<'profiles'>;
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
import { Label } from "@/components/ui/label"; // Import Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

// Removed TempUser type definition
// Helper functions (copied - consider moving to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};
// Note: Role/Status helpers are defined in columns.tsx

// Function to fetch users from Supabase
// WARNING: Fetching email from auth.users requires admin privileges and is inefficient client-side.
// Recommended approach: Create a Supabase database function (e.g., 'get_admin_users')
// that joins profiles and auth.users securely and returns the combined data.
const fetchUsers = async (): Promise<User[]> => {
  // Call the RPC function instead of direct table query
  const { data, error } = await supabase.rpc('get_admin_users');

  if (error) {
    console.error("Supabase RPC error (get_admin_users):", error);
    // Check for permission denied error specifically
    if (error.message.includes('Permission denied')) {
        toast.error("Access Denied: You must be an admin to view users.");
        throw new Error("Permission denied: User must be an admin."); // Throw specific error
    }
    throw new Error(error.message || 'Failed to fetch users via RPC');
  }

  // Ensure data is not null and is an array before returning
  return (data || []) as User[];
};


const AdminUserManagement: React.FC = () => {
  // Use correct User type for query
  const { data: users = [], isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // State for dialogs
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string | null; // Use full_name or email for display
    actionType: 'delete' | 'suspend' | 'reactivate' | 'editRole' | null; // Add back actions
  }>({ isOpen: false, userId: null, userName: null, actionType: null });

  // Add state for role editing
  const [selectedRole, setSelectedRole] = useState<UserRole | string>('');

  // --- Mutations ---

  // Uncommented and updated status update mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      // Ensure we only update the status field
      const updateData: Partial<Profile> = { status };
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select('id') // Select something to confirm success
        .single(); // Ensure only one row is updated

      if (error) {
        console.error("Supabase update error (status):", error);
        throw new Error(error.message || 'Failed to update user status');
      }
    },
    onSuccess: (_, variables) => {
      toast.success(`User status updated to ${variables.status}.`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user status: ${error.message}`);
    },
    onSettled: () => {
      setDialogState({ isOpen: false, userId: null, userName: null, actionType: null });
    }
  });


  // Uncommented and updated role update mutation
   const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
       // Ensure we only update the role field
       const updateData: Partial<Profile> = { role };
       const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', id)
        .select('id') // Select something to confirm success
        .single(); // Ensure only one row is updated

       if (error) {
         console.error("Supabase update error (role):", error);
         throw new Error(error.message || 'Failed to update user role');
       }
    },
     onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.role}.`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    },
     onSettled: () => {
      setDialogState({ isOpen: false, userId: null, userName: null, actionType: null });
    }
  });

   // Placeholder mutation for delete (VERY DANGEROUS - requires Edge Function ideally)
   // Keep this as it doesn't depend on role/status columns
   const deleteUserMutation = useMutation({
     mutationFn: async ({ id }: { id: string }) => {
       console.warn(`Placeholder: Deleting user ${id}. Requires Supabase Admin privileges / Edge Function.`);
       await new Promise(res => setTimeout(res, 500));
     },
      onSuccess: (_, variables) => {
       toast.success(`User ${variables.id} deleted (Placeholder).`);
       queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
     },
     onError: (error: Error) => {
       toast.error(`Failed to delete user: ${error.message}`);
     },
      onSettled: () => {
       setDialogState({ isOpen: false, userId: null, userName: null, actionType: null });
     }
   });


  // --- Action Handlers ---
  // Use correct User type and add back action types
  const openConfirmationDialog = (user: User, action: typeof dialogState.actionType) => {
    setDialogState({
        isOpen: true,
        userId: user.id,
        userName: user.full_name || user.email, // Display name or email
        actionType: action
    });
    // Add back role pre-fill
    if (action === 'editRole') {
        setSelectedRole(user.role || '');
    }
  };

   // Function to open View Profile (placeholder for now)
   // Use correct User type
  const openViewProfile = (user: User) => {
    console.log("View Profile action for:", user);
    toast.info("View Profile action not implemented yet.");
  };


  const handleConfirmAction = () => {
    if (!dialogState.userId || !dialogState.actionType) return;

    switch (dialogState.actionType) {
        // Uncommented status/role actions
        case 'suspend':
            updateUserStatusMutation.mutate({ id: dialogState.userId, status: 'suspended' });
            break;
        case 'reactivate':
             updateUserStatusMutation.mutate({ id: dialogState.userId, status: 'active' });
            break;
         case 'editRole':
             if (selectedRole && ['user', 'admin', 'moderator'].includes(selectedRole)) {
                 updateUserRoleMutation.mutate({ id: dialogState.userId, role: selectedRole as UserRole });
             } else {
                 toast.error("No role selected or invalid role.");
                 setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); // Close dialog if no role
             }
            break;
        case 'delete':
            deleteUserMutation.mutate({ id: dialogState.userId });
            break;
        default:
             setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); // Close if action unhandled
    }
  };

   // --- Table Setup ---
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [rowSelection, setRowSelection] = useState({});

   // Pass correct action handlers to columns
   const memoizedColumns = useMemo(
     () => columns(openConfirmationDialog, openViewProfile),
     // eslint-disable-next-line react-hooks/exhaustive-deps
     [] // Dependencies remain empty if handlers don't change identity often
   );

    const usersTable = useReactTable({
     data: users,
     columns: memoizedColumns, // Use the updated columns
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
      {/* Removed h1 title */}

      <Card className="border border-border/50"> {/* Wrap content in a Card */}
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          {/* Optional: Add description here */}
        </CardHeader>
        <CardContent className="space-y-4"> {/* Add spacing inside card content */}
          {/* Filters */}
          <div className="flex items-center gap-2"> {/* Removed py-4 */}
            {/* Email Filter is handled inside DataTable */}
            {/* Role Filter */}
            <Select
              value={usersTable.getColumn("role")?.getFilterValue() as string ?? "all"} // Default value to "all" if filter is undefined
              onValueChange={(value) => {
                // If 'all' is selected, clear the filter (set to undefined), otherwise set the filter value
                usersTable.getColumn("role")?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem> {/* Changed value from "" to "all" */}
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={usersTable.getColumn("status")?.getFilterValue() as string ?? "all"} // Default value to "all" if filter is undefined
              onValueChange={(value) => {
                // If 'all' is selected, clear the filter (set to undefined), otherwise set the filter value
                usersTable.getColumn("status")?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem> {/* Changed value from "" to "all" */}
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
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
              <AlertTitle>Error Loading Users</AlertTitle>
              <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
            </Alert>
          ) : (
            // Use correct User type for DataTable
            <DataTable columns={memoizedColumns as ColumnDef<User>[]} table={usersTable as any} />
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs (remain outside the card) */}
      {/* Keep Delete Dialog */}
       <AlertDialog
        open={dialogState.isOpen && dialogState.actionType === 'delete'}
        onOpenChange={(open) => { if (!open) setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action: Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the user "{dialogState.userName || 'this user'}"?
              <span className="font-bold text-red-600"> This action is irreversible (Placeholder).</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={deleteUserMutation.isPending}
              className={'bg-red-600 hover:bg-red-700'}
            >
              {deleteUserMutation.isPending ? 'Processing...' : `Confirm Delete`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Uncommented Edit Role Dialog */}
       <AlertDialog
        open={dialogState.isOpen && dialogState.actionType === 'editRole'}
        onOpenChange={(open) => { if (!open) setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); }}
      >
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Edit User Role</AlertDialogTitle>
             <AlertDialogDescription>
               Select a new role for "{dialogState.userName || 'this user'}". Use with caution.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <div className="py-4 space-y-2">
             <Label htmlFor="role-select">New Role</Label>
             <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                disabled={updateUserRoleMutation.isPending}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
           </div>
           <AlertDialogFooter>
             <AlertDialogCancel disabled={updateUserRoleMutation.isPending}>Cancel</AlertDialogCancel>
             <AlertDialogAction
               onClick={handleConfirmAction}
               disabled={updateUserRoleMutation.isPending || !selectedRole}
             >
               {updateUserRoleMutation.isPending ? 'Saving...' : 'Save Role'}
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>

    </div> // Closing div for the main component wrapper
  );
};

export default AdminUserManagement;
