"use client"; // Required for TanStack Table v8

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
import { cn } from "@/lib/utils";
import type { Operator, OperatorStatus } from "./types"; // Import Operator type from new file

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

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
  switch (status as OperatorStatus) { // Cast to known statuses
    case 'verified':
      return 'default'; // Use theme's default (often blue/greenish)
    case 'pending_verification': // Matches DB schema? Assuming yes.
      return 'secondary'; // Use theme's secondary (often gray/yellowish)
    case 'rejected':
    case 'suspended':
      return 'destructive'; // Use theme's destructive (reddish)
    default:
      return 'outline'; // Default outline for unknown statuses
  }
};

// Helper function to format status text (can be moved to utils)
const formatStatusText = (status: string | null): string => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
};

// Modify columns to accept action handler functions
export const columns = (
    openConfirmationDialog: (operator: Operator, action: 'approve' | 'reject' | 'suspend' | 'reactivate') => void,
    openViewDetailsSheet: (operator: Operator) => void // Add handler for sheet
): ColumnDef<Operator>[] => [
  // 1. Select Checkbox Column
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

  // 2. Business Name Column
  {
    accessorKey: "business_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Business Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("business_name") || 'N/A'}</div>,
  },

  // 3. Contact Name Column
  {
    accessorKey: "contact_person_name", // Updated accessorKey
     header: "Contact Name",
     cell: ({ row }) => <div>{row.getValue("contact_person_name") || 'N/A'}</div>,
  },

  // 4. Email Column
  {
    accessorKey: "contact_email", // Updated accessorKey
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
     cell: ({ row }) => <div>{row.getValue("contact_email") || 'N/A'}</div>,
  },

  // 5. Status Column
  {
    accessorKey: "status",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string; // Get status as string
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {formatStatusText(status)}
        </Badge>
      );
    },
    // Add filter function for status dropdown
    filterFn: (row, id, value) => {
        // 'value' will be an array of selected statuses from the filter component
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 6. Date Registered Column
  {
    accessorKey: "created_at",
    header: ({ column }) => {
       return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
  },

  // 7. Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const operator = row.original;

      // Use the passed-in handlers
      const handleViewDetails = () => openViewDetailsSheet(operator); // Use sheet handler
      const handleApprove = () => openConfirmationDialog(operator, 'approve');
      const handleReject = () => openConfirmationDialog(operator, 'reject');
      const handleSuspend = () => openConfirmationDialog(operator, 'suspend');
      const handleReactivate = () => openConfirmationDialog(operator, 'reactivate');


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
            <DropdownMenuItem onClick={handleViewDetails}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {operator.status === 'pending_verification' && (
              <>
                <DropdownMenuItem onClick={handleApprove} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReject} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {operator.status === 'verified' && (
              <DropdownMenuItem onClick={handleSuspend} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                Suspend
              </DropdownMenuItem>
            )}
             {operator.status === 'suspended' && (
              <DropdownMenuItem onClick={handleReactivate} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                Reactivate
              </DropdownMenuItem>
            )}
             {/* Add Edit option if needed */}
             {/* <DropdownMenuItem onClick={() => console.log("Edit:", operator.id)}>Edit</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
