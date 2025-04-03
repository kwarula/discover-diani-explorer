"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, ExternalLink, UserX, ShieldCheck, ShieldX } from "lucide-react";
import { Link } from "react-router-dom"; // For linking to content/user

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
import type { FlaggedContent } from "./types"; // Import type

// Helper function to format date (can be moved to utils)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status: FlaggedContent['status']): "default" | "secondary" | "outline" => {
  switch (status) {
    case 'Pending':
      return 'secondary'; // Yellowish/Gray
    case 'Resolved':
      return 'default'; // Greenish/Blue
    default:
      return 'outline';
  }
};

// Helper function to create a link to the content (adjust URL structure as needed)
const getContentUrl = (item: FlaggedContent): string | null => {
    if (!item.content_id) return null;
    switch (item.content_type?.toLowerCase()) {
        case 'review':
            // Assuming reviews are part of a listing page, need listing ID too?
            // This is a placeholder URL structure
            return `/explore/listing/some-listing-id#review-${item.content_id}`;
        case 'comment':
            // Assuming comments are on blog posts or listings?
            // Placeholder URL structure
            return `/blog/post/some-post-id#comment-${item.content_id}`;
        case 'listing':
            return `/explore/listing/${item.content_id}`;
        default:
            return null;
    }
}

export const columns: ColumnDef<FlaggedContent>[] = [
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

  // 2. Content Snippet
  {
    accessorKey: "content_snippet",
    header: "Content Snippet",
    cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue("content_snippet") || ''}>
            {row.getValue("content_snippet") || 'N/A'}
        </div>
    ),
  },

  // 3. Content Type
  {
    accessorKey: "content_type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("content_type") || 'N/A'}</div>,
     filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 4. Reason Flagged
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <div>{row.getValue("reason") || 'N/A'}</div>,
  },

  // 5. Reported By
  {
    accessorKey: "reported_by_email",
    header: "Reported By",
    cell: ({ row }) => <div>{row.getValue("reported_by_email") || 'N/A'}</div>,
    // Could link to user profile if needed: /admin/users/{reported_by_user_id}
  },

  // 6. Date Reported
  {
    accessorKey: "reported_at",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Reported
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("reported_at"))}</div>,
  },

   // 7. Status
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
       const status = row.getValue("status") as FlaggedContent['status'];
       return <Badge variant={getStatusBadgeVariant(status)}>{status || 'Unknown'}</Badge>;
    },
     filterFn: (row, id, value) => {
        return value.length === 0 || value.includes(row.getValue(id));
    },
  },

  // 8. Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const contentUrl = getContentUrl(item);

      // TODO: Implement actual action handlers
      const handleApproveContent = () => console.log("Approve Content (Dismiss Flag):", item.id);
      const handleRemoveContent = () => console.log("Remove Content:", item.id);
      const handleWarnUser = () => console.log("Warn User:", item.reported_by_user_id);
      const handleSuspendUser = () => console.log("Suspend User:", item.reported_by_user_id);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Moderation</DropdownMenuLabel>
            {contentUrl && (
                 <DropdownMenuItem asChild>
                    <a href={contentUrl} target="_blank" rel="noopener noreferrer">
                        View in Context <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                 </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
             {item.status === 'Pending' && (
                <>
                    <DropdownMenuItem onClick={handleApproveContent} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                        <ShieldCheck className="mr-2 h-4 w-4" /> Approve Content (Dismiss)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRemoveContent} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                       <ShieldX className="mr-2 h-4 w-4" /> Remove Content
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Actions related to the reporting user */}
                    {item.reported_by_user_id && (
                        <>
                            <DropdownMenuItem onClick={handleWarnUser} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                                Warn User ({item.reported_by_email})
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSuspendUser} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                <UserX className="mr-2 h-4 w-4" /> Suspend User ({item.reported_by_email})
                            </DropdownMenuItem>
                        </>
                    )}
                </>
             )}
             {item.status === 'Resolved' && (
                 <DropdownMenuItem disabled>
                    Already Resolved
                 </DropdownMenuItem>
             )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
