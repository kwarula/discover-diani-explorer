"use client" // Required for TanStack Table + Next.js App Router / Client Components

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge" // For featured status
import type { POI } from "./types" // Import the local POI type

// Helper function for formatting dates (consider moving to a shared utils file)
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try { return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString)); } catch (e) { return 'Invalid Date'; }
};

// TODO: Define action handlers passed from the parent component
type ActionHandlers = {
  onViewDetails: (poi: POI) => void;
  onEdit: (poi: POI) => void;
  onDelete: (poi: POI) => void;
};

export const createColumns = (actions: ActionHandlers): ColumnDef<POI>[] => [
  // Select Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Name Column
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  // Category Column
  {
    accessorKey: "category",
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
    filterFn: (row, id, value) => { // Enable filtering for this column
      return value.includes(row.getValue(id))
    },
  },
   // Featured Column
  {
    accessorKey: "featured",
    header: "Featured",
     cell: ({ row }) => {
       const isFeatured = row.getValue("featured");
       return isFeatured ? <Badge variant="secondary">Yes</Badge> : <Badge variant="outline">No</Badge>;
     },
     filterFn: (row, id, value) => { // Enable filtering for boolean
       return value === 'all' || (value === 'true' && row.getValue(id)) || (value === 'false' && !row.getValue(id));
     },
  },
  // Created At Column
  {
    accessorKey: "created_at",
    header: ({ column }) => {
       return (
         <Button
           variant="ghost"
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
           Created At
           <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       )
     },
    cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
  },
   // Updated At Column
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
       return (
         <Button
           variant="ghost"
           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
           Last Updated
           <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
       )
     },
    cell: ({ row }) => <div>{formatDate(row.getValue("updated_at"))}</div>,
  },
  // Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const poi = row.original

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
            <DropdownMenuItem onClick={() => actions.onViewDetails(poi)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onEdit(poi)}>
              Edit POI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => actions.onDelete(poi)}
              className="text-red-600 focus:text-red-700 focus:bg-red-100"
            >
              Delete POI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
     enableSorting: false,
     enableHiding: false,
  },
]
