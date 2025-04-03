"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom"; // For linking to live listing

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
import type { Listing } from "./types"; // Import from the dedicated types file

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

// Helper function to determine badge variant based on listing status
const getStatusBadgeVariant = (status: Listing['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'approved':
    case 'featured': // Maybe a different color? Using default for now.
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
    case 'flagged': // Flagged might need a warning color (e.g., orange) - using destructive for now
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper function to format status text (can be moved to utils)
const formatStatusText = (status: Listing['status']): string => {
  if (!status) return 'Unknown';
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Modify columns to accept action handler functions
export const columns = (
    openConfirmationDialog: (listing: Listing, action: 'approve' | 'reject' | 'feature' | 'unfeature' | 'unpublish' | 'republish') => void,
    openViewEditSheet: (listing: Listing) => void
): ColumnDef<Listing>[] => [
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

  // 2. Listing Title
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Listing Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("title") || 'N/A'}</div>,
  },

  // 3. Operator Name
  {
    accessorKey: "operator_name",
    header: "Operator Name",
    cell: ({ row }) => <div>{row.getValue("operator_name") || 'N/A'}</div>,
    // Note: Sorting/Filtering might be complex if this requires a join
  },

  // 4. Category
  {
    accessorKey: "category",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("category") || 'N/A'}</div>,
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
      const status = row.getValue("status") as Listing['status'];
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {formatStatusText(status)}
        </Badge>
      );
    },
     filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 6. Date Submitted
  {
    accessorKey: "submitted_at",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Submitted
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("submitted_at"))}</div>,
  },

  // 7. Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const listing = row.original;

      // Use passed-in handlers
      const handleViewEdit = () => openViewEditSheet(listing);
      const handleApprove = () => openConfirmationDialog(listing, 'approve');
      const handleReject = () => openConfirmationDialog(listing, 'reject');
      const handleFeature = () => openConfirmationDialog(listing, 'feature');
      const handleUnfeature = () => openConfirmationDialog(listing, 'unfeature');
      const handleUnpublish = () => openConfirmationDialog(listing, 'unpublish');
      const handleRepublish = () => openConfirmationDialog(listing, 'republish');
      // TODO: Construct live listing URL based on slug/ID
      const liveListingUrl = `/explore/listing/${listing.id}`; // Example URL

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
            <DropdownMenuItem onClick={handleViewEdit}>
              View / Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link to={liveListingUrl} target="_blank" rel="noopener noreferrer">
                 View Live Listing <ExternalLink className="ml-2 h-3 w-3" />
               </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {listing.status === 'pending' && (
              <>
                <DropdownMenuItem onClick={handleApprove} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReject} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {listing.status === 'approved' && (
              <>
                <DropdownMenuItem onClick={handleFeature} className="text-purple-600 focus:text-purple-700 focus:bg-purple-50">
                  Feature
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleUnpublish} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                  Unpublish
                </DropdownMenuItem>
              </>
            )}
             {listing.status === 'featured' && (
              <>
                <DropdownMenuItem onClick={handleUnfeature} className="text-purple-600 focus:text-purple-700 focus:bg-purple-50">
                  Unfeature
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleUnpublish} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                  Unpublish
                </DropdownMenuItem>
              </>
            )}
             {/* Add Republish for unpublished/rejected? */}
             {(listing.status === 'rejected' /* || listing.status === 'unpublished' */) && (
                 <DropdownMenuItem onClick={handleRepublish} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                  Republish (Approve)
                </DropdownMenuItem>
             )}
             {/* Add actions for flagged content? */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
