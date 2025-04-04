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
import type { User } from './types'; // Import User type from types.ts
import type { Profile } from '@/types/database'; // Import Profile type
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
import { Label } from "@/components/ui/label"; // Import Label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components

// Reverted User type to remove role/status dependency for now
type TempUser = {
  id: string;
  full_name: string | null;
  email: string | null; // Still placeholder
  created_at: string;
  // role: 'user' | 'admin' | 'moderator'; // Removed
  // status: 'active' | 'suspended' | 'banned'; // Removed
};


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
const fetchUsers = async (): Promise<TempUser[]> => {
  // Reverted: Fetch profiles without role and status
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, created_at'); // Removed role and status

  if (profilesError) {
    console.error("Supabase fetch error (profiles):", profilesError);
    throw new Error(profilesError.message || 'Failed to fetch user profiles');
  }

  // Using placeholder email - replace this fetch with an RPC call to a secure database function
  // that joins profiles and auth.users to get the real email.
  return (profilesData || []).map(profile => ({
    id: profile.id,
    full_name: profile.full_name,
    email: `user_${profile.id.substring(0, 5)}@placeholder.com`, // *** PLACEHOLDER EMAIL ***
    created_at: profile.created_at,
    // role: 'user', // Removed
    // status: 'active', // Removed
  }));
};

// Reverted: Removed specific enum types
// type UserStatus = 'active' | 'suspended' | 'banned';
// type UserRole = 'user' | 'admin' | 'moderator';

const AdminUserManagement: React.FC = () => {
  // Use TempUser type for query
  const { data: users = [], isLoading, isError, error } = useQuery<TempUser[], Error>({
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
    actionType: 'delete' | null; // Reverted: Removed suspend, reactivate, editRole
  }>({ isOpen: false, userId: null, userName: null, actionType: null });

  // Reverted: Removed state for role editing
  // const [selectedRole, setSelectedRole] = useState<UserRole | string>('');

  // --- Mutations ---

  // Reverted: Commented out status update mutation
  /*
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: status } as Partial<Profile>) // Assert type for local TS check
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
  */

  // Reverted: Commented out role update mutation
  /*
   const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
       const { error } = await supabase
        .from('profiles')
        .update({ role: role } as Partial<Profile>) // Assert type for local TS check
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
  */

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
  const openConfirmationDialog = (user: TempUser, action: typeof dialogState.actionType) => {
    setDialogState({
        isOpen: true,
        userId: user.id,
        userName: user.full_name || user.email, // Display name or email
        actionType: action
    });
    // Reverted: Removed role pre-fill
    // if (action === 'editRole') {
    //     setSelectedRole(user.role || '');
    // }
  };

   // Function to open View Profile (placeholder for now)
  const openViewProfile = (user: TempUser) => {
    console.log("View Profile action for:", user);
    toast.info("View Profile action not implemented yet.");
  };


  const handleConfirmAction = () => {
    if (!dialogState.userId || !dialogState.actionType) return;

    switch (dialogState.actionType) {
        // Reverted: Commented out status/role actions
        /*
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
                 toast.error("No role selected.");
                 setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); // Close dialog if no role
             }
            break;
        */
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

   // Pass reverted action handlers to columns
   const memoizedColumns = useMemo(
     () => columns(openConfirmationDialog as any, openViewProfile as any), // Use 'as any' for now as User type changed
     // eslint-disable-next-line react-hooks/exhaustive-deps
     []
   );

    const usersTable = useReactTable({
     data: users,
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
      <h1 className="text-2xl font-semibold">User Management</h1>

      {/* Reverted: Commented out Filters */}
       {/* <div className="flex items-center py-4 gap-2"> */}
          {/* Email Filter is handled inside DataTable */}
          {/* Role Filter */}
          {/* <Select
            value={usersTable.getColumn("role")?.getFilterValue() as string ?? ""}
            onValueChange={(value) => usersTable.getColumn("role")?.setFilterValue(value || undefined)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select> */}

          {/* Status Filter */}
          {/* <Select
            value={usersTable.getColumn("status")?.getFilterValue() as string ?? ""}
            onValueChange={(value) => usersTable.getColumn("status")?.setFilterValue(value || undefined)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select> */}
        {/* </div> */}

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
        // Use TempUser type for DataTable
        <DataTable columns={memoizedColumns as ColumnDef<TempUser>[]} table={usersTable as any} />
      )}

      {/* Action Dialogs */}
      {/* Reverted: Only keep Delete Dialog */}
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

      {/* Reverted: Commented out Edit Role Dialog */}
       {/* <AlertDialog
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
       </AlertDialog> */}

    </div>
  );
};

export default AdminUserManagement;
