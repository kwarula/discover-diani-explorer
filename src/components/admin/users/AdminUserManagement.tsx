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
// TODO: Import Select for Edit Role dialog if needed
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// User type is now defined and exported from ./types.ts

// Helper functions (copied - consider moving to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};
// Note: Role/Status helpers are defined in columns.tsx

// Function to fetch users from Supabase
// This is complex as user data is split between auth.users and public.profiles
// We might need a Supabase function or fetch separately and combine client-side.
// Placeholder: Fetching profiles and assuming email/created_at can be inferred or fetched separately if needed.
// WARNING: This fetch might be incomplete or require adjustments based on actual auth setup.
const fetchUsers = async (): Promise<User[]> => {
  // Fetch profiles first
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, created_at'); // Removed username, Add other profile fields if needed (role, status?)

  if (profilesError) {
    console.error("Supabase fetch error (profiles):", profilesError);
    throw new Error(profilesError.message || 'Failed to fetch user profiles');
  }

  // TODO: Fetch corresponding auth.users data (email, maybe created_at if different)
  // This might require iterating through profile IDs or a Supabase function.
  // For now, using placeholder email and assuming profile created_at.
  // Also assuming 'role' and 'status' are stored in 'profiles' table (add them to select if so).

  return (profilesData || []).map(profile => ({
    id: profile.id,
    full_name: profile.full_name,
    email: `user_${profile.id.substring(0, 5)}@placeholder.com`, // Placeholder email
    // role: profile.role || 'Tourist', // Example if role is in profiles
    // status: profile.status || 'Active', // Example if status is in profiles
    role: 'Tourist', // Hardcoded placeholder role
    status: 'Active', // Hardcoded placeholder status
    created_at: profile.created_at,
  })) as User[]; // Cast needed
};

// Define possible user statuses/roles for actions/filtering
type UserStatus = 'Active' | 'Suspended';
type UserRole = 'Tourist' | 'Local' | 'Operator' | 'Admin';

const AdminUserManagement: React.FC = () => {
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
    actionType: 'suspend' | 'reactivate' | 'delete' | 'editRole' | null;
  }>({ isOpen: false, userId: null, userName: null, actionType: null });

  // State for role editing
  const [selectedRole, setSelectedRole] = useState<UserRole | string>('');

  // --- Mutations ---
  // TODO: Implement mutations for updating role (profiles table?), status (profiles/auth?), and deleting user (auth + profiles)
  // These might require Supabase Edge Functions for proper handling, especially delete.

  // Placeholder mutation for status change (assuming status is in profiles)
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      // WARNING: This assumes 'status' column exists in 'profiles'. Adjust if needed.
      // Also, suspending/deleting users in Supabase Auth requires admin privileges and specific API calls,
      // likely best handled via Edge Functions. This is a simplified placeholder.
      console.warn("Placeholder: Updating user status in profiles table only.");
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ status: status }) // Assuming 'status' column exists
      //   .eq('id', id);
      // if (error) throw new Error(error.message);
      await new Promise(res => setTimeout(res, 500)); // Simulate network delay
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

  // Placeholder mutation for role change (assuming role is in profiles)
   const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole | string }) => {
      console.warn("Placeholder: Updating user role in profiles table only.");
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({ role: role }) // Assuming 'role' column exists
      //   .eq('id', id);
      // if (error) throw new Error(error.message);
       await new Promise(res => setTimeout(res, 500));
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
   const deleteUserMutation = useMutation({
     mutationFn: async ({ id }: { id: string }) => {
       console.warn(`Placeholder: Deleting user ${id}. Requires Supabase Admin privileges / Edge Function.`);
       // **NEVER run auth user deletion directly from client-side without proper security**
       // Example (requires admin client/function):
       // const { error } = await supabase.auth.admin.deleteUser(id);
       // if (error) throw error;
       // Also delete from profiles table:
       // await supabase.from('profiles').delete().eq('id', id);
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
  const openConfirmationDialog = (user: User, action: typeof dialogState.actionType) => {
    setDialogState({
        isOpen: true,
        userId: user.id,
        userName: user.full_name || user.email, // Display name or email
        actionType: action
    });
    if (action === 'editRole') {
        setSelectedRole(user.role || ''); // Pre-fill role for editing
    }
  };

   // Function to open View Profile (placeholder for now)
  const openViewProfile = (user: User) => {
    console.log("View Profile action for:", user);
    toast.info("View Profile action not implemented yet.");
  };


  const handleConfirmAction = () => {
    if (!dialogState.userId || !dialogState.actionType) return;

    switch (dialogState.actionType) {
        case 'suspend':
            updateUserStatusMutation.mutate({ id: dialogState.userId, status: 'Suspended' });
            break;
        case 'reactivate':
             updateUserStatusMutation.mutate({ id: dialogState.userId, status: 'Active' });
            break;
         case 'editRole':
             if (selectedRole) {
                 updateUserRoleMutation.mutate({ id: dialogState.userId, role: selectedRole });
             } else {
                 toast.error("No role selected.");
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

   const memoizedColumns = useMemo(
     () => columns(openConfirmationDialog, openViewProfile), // Pass handlers
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

      {/* Filters */}
       <div className="flex items-center py-4 gap-2">
          {/* Email Filter is handled inside DataTable */}
          {/* TODO: Implement Role Filter Dropdown */}
           <Skeleton className="h-10 w-[180px]" /> {/* Role Filter placeholder */}
           {/* TODO: Implement Status Filter Dropdown */}
           <Skeleton className="h-10 w-[180px]" /> {/* Status Filter placeholder */}
        </div>

      {/* Table */}
       {isLoading ? (
         <div className="space-y-4">
           {/* Keep skeleton filters for loading state */}
           <div className="flex items-center py-4 gap-2">
             <Skeleton className="h-10 w-[250px]" /> {/* Email Filter placeholder */}
             <Skeleton className="h-10 w-[180px]" /> {/* Role Filter placeholder */}
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
            <AlertTitle>Error Loading Users</AlertTitle>
            <AlertDescription>{error?.message || "An unexpected error occurred."}</AlertDescription>
          </Alert>
      ) : (
        <DataTable columns={memoizedColumns} table={usersTable} />
      )}

      {/* Action Dialogs */}
      {/* Suspend/Reactivate/Delete Dialog */}
       <AlertDialog
        open={dialogState.isOpen && ['suspend', 'reactivate', 'delete'].includes(dialogState.actionType || '')}
        onOpenChange={(open) => { if (!open) setDialogState({ isOpen: false, userId: null, userName: null, actionType: null }); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action: {dialogState.actionType?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {dialogState.actionType} the user "{dialogState.userName || 'this user'}"?
              {dialogState.actionType === 'delete' && <span className="font-bold text-red-600"> This action is irreversible.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateUserStatusMutation.isPending || deleteUserMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={updateUserStatusMutation.isPending || deleteUserMutation.isPending}
              className={dialogState.actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' : dialogState.actionType === 'suspend' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {updateUserStatusMutation.isPending || deleteUserMutation.isPending ? 'Processing...' : `Confirm ${dialogState.actionType?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Role Dialog (Placeholder - Needs Select component) */}
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
           <div className="py-4">
             {/* TODO: Replace with actual Select component */}
             <Label htmlFor="role-select">New Role</Label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                disabled={updateUserRoleMutation.isPending}
              >
                <option value="" disabled>Select a role...</option>
                <option value="Tourist">Tourist</option>
                <option value="Local">Local</option>
                <option value="Operator">Operator</option>
                {/* Only allow assigning Admin role explicitly if needed, maybe hide option */}
                {/* <option value="Admin">Admin</option> */}
              </select>
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

    </div>
  );
};

export default AdminUserManagement;
