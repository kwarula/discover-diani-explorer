"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge"; // Reverted: Removed Badge import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Reverted: Use TempUser type consistent with AdminUserManagement
// import type { User } from "./types";
type TempUser = {
  id: string;
  full_name: string | null;
  email: string | null; // Still placeholder
  created_at: string;
};


// Helper function to format date (can be moved to utils)
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

// Reverted: Removed badge helper functions
// const getRoleBadgeVariant = ...
// const getStatusBadgeVariant = ...

// Modify columns to accept action handler functions
// Reverted: Changed User type to TempUser and removed role/status actions
export const columns = (
    openConfirmationDialog: (user: TempUser, action: 'delete') => void,
    openViewProfile: (user: TempUser) => void
): ColumnDef<TempUser>[] => [
  // 1. Select Checkbox
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Full Name
  {
    accessorKey: "full_name",
     header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("full_name") || 'N/A'}</div>,
  },

  // 3. Email
  {
    accessorKey: "email",
     header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("email") || 'N/A'}</div>,
  },

  // Reverted: Removed Role Column
  /*
  {
    accessorKey: "role",
    header: ({ column }) => ( ... ),
    cell: ({ row }) => { ... },
    filterFn: (row, id, value) => { ... },
  },
  */

  // Reverted: Removed Status Column
  /*
  {
    accessorKey: "status",
     header: ({ column }) => ( ... ),
    cell: ({ row }) => { ... },
     filterFn: (row, id, value) => { ... },
  },
  */

  // 4. Date Joined (was 6)
  {
    accessorKey: "created_at",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Joined
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
  },

  // 5. Actions (was 7)
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      // Use passed-in handlers
      const handleViewProfile = () => openViewProfile(user);
      // Reverted: Removed role/status action handlers
      // const handleEditRole = () => openConfirmationDialog(user, 'editRole');
      // const handleSuspend = () => openConfirmationDialog(user, 'suspend');
      // const handleReactivate = () => openConfirmationDialog(user, 'reactivate');
      const handleDelete = () => openConfirmationDialog(user, 'delete');


      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleViewProfile}>
              View Profile
            </DropdownMenuItem>
            {/* Reverted: Removed role/status actions from menu */}
            {/* {user.role?.toLowerCase() !== 'admin' && ( */}
              <>
                {/* <DropdownMenuItem onClick={handleEditRole}>
                  Edit Role
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                {/* {user.status === 'Active' ? (
                  <DropdownMenuItem onClick={handleSuspend} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                    Suspend User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleReactivate} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                    Reactivate User
                  </DropdownMenuItem>
                )} */}
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  Delete User (Placeholder)
                </DropdownMenuItem>
              </>
            {/* )} */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
