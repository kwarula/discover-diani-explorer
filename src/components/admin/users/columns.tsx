"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "./types"; // Import User type from types.ts (will create next)

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

// Helper function to determine badge variant based on user status/role
const getRoleBadgeVariant = (role: User['role']): "default" | "secondary" | "destructive" | "outline" => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'destructive'; // Highlight admin role
    case 'operator':
      return 'default';
    case 'local':
      return 'secondary';
    case 'tourist':
    default:
      return 'outline';
  }
};

const getStatusBadgeVariant = (status: User['status']): "default" | "destructive" | "outline" => {
   switch (status?.toLowerCase()) {
    case 'active':
      return 'default';
    case 'suspended':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Modify columns to accept action handler functions
export const columns = (
    openConfirmationDialog: (user: User, action: 'suspend' | 'reactivate' | 'delete' | 'editRole') => void,
    openViewProfile: (user: User) => void
): ColumnDef<User>[] => [
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

  // 4. Role
  {
    accessorKey: "role",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
       const role = row.getValue("role") as User['role'];
       return <Badge variant={getRoleBadgeVariant(role)}>{role || 'Unknown'}</Badge>;
    },
     filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 5. Status
  {
    accessorKey: "status",
     header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
       const status = row.getValue("status") as User['status'];
       return <Badge variant={getStatusBadgeVariant(status)}>{status || 'Unknown'}</Badge>;
    },
     filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 6. Date Joined
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

  // 7. Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      // Use passed-in handlers
      const handleViewProfile = () => openViewProfile(user);
      const handleEditRole = () => openConfirmationDialog(user, 'editRole');
      const handleSuspend = () => openConfirmationDialog(user, 'suspend');
      const handleReactivate = () => openConfirmationDialog(user, 'reactivate');
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
             {/* Prevent Admin from editing own role or being suspended/deleted */}
            {user.role?.toLowerCase() !== 'admin' && (
              <>
                <DropdownMenuItem onClick={handleEditRole}>
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.status === 'Active' ? (
                  <DropdownMenuItem onClick={handleSuspend} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                    Suspend User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleReactivate} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                    Reactivate User
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  Delete User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
