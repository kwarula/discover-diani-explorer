
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, ExternalLink, UserX, ShieldCheck, ShieldX } from "lucide-react";

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
import { FlaggedContent } from "./types";
import { formatDate, getContentUrl, formatStatusText } from "./utils";

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'Resolved':
      return 'default';
    default:
      return 'outline';
  }
};

// Export a function that returns the columns, taking the necessary handlers as arguments
export function createColumns(
  openConfirmationDialog: (item: FlaggedContent, action: 'approve' | 'remove') => void,
  handleWarnUser: (userId: string | null) => void,
  handleSuspendUser: (userId: string | null) => void
): ColumnDef<FlaggedContent>[] {
  return [
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
         const status = row.getValue("status") as string;
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
                      <DropdownMenuItem onClick={() => openConfirmationDialog(item, 'approve')} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                          <ShieldCheck className="mr-2 h-4 w-4" /> Approve Content (Dismiss)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openConfirmationDialog(item, 'remove')} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                         <ShieldX className="mr-2 h-4 w-4" /> Remove Content
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Actions related to the reporting user */}
                      {item.reported_by_user_id && (
                          <>
                              <DropdownMenuItem onClick={() => handleWarnUser(item.reported_by_user_id)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                                  Warn User ({item.reported_by_email})
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSuspendUser(item.reported_by_user_id)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
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
    }
  ];
}
