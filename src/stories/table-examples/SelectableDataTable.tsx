"use client";

import {
  type ColumnDef,
  columnVisibilityFeature,
  flexRender,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Frame } from "@/components/ui/frame";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Project = {
  id: string;
  project: string;
  status: "Paid" | "Unpaid" | "Pending" | "Failed";
  team: string;
  budget: number;
};

const data: Project[] = [
  { budget: 12500, id: "1", project: "Website Redesign", status: "Paid", team: "Frontend Team" },
  { budget: 8750, id: "2", project: "Mobile App", status: "Unpaid", team: "Mobile Team" },
  { budget: 5200, id: "3", project: "API Integration", status: "Pending", team: "Backend Team" },
  { budget: 3800, id: "4", project: "Database Migration", status: "Paid", team: "DevOps Team" },
  { budget: 7200, id: "5", project: "User Dashboard", status: "Paid", team: "UX Team" },
  { budget: 2100, id: "6", project: "Security Audit", status: "Failed", team: "Security Team" },
];

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-500";
    case "Unpaid":
      return "bg-muted-foreground/64";
    case "Pending":
      return "bg-amber-500";
    case "Failed":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/64";
  }
};

const features = tableFeatures({
  columnVisibilityFeature,
  rowSelectionFeature,
});

const getColumns = (): ColumnDef<typeof features, Project>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          aria-label="Select all"
          checked={isAllSelected}
          indeterminate={isSomeSelected && !isAllSelected}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      );
    },
    id: "select",
  },
  {
    accessorKey: "project",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("project")}</div>
    ),
    header: "Project",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Project["status"];
      return (
        <Badge variant="outline">
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${getStatusColor(status)}`}
          />
          {status}
        </Badge>
      );
    },
    header: "Status",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "budget",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("budget"));
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        style: "currency",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
    header: () => <div className="text-right">Budget</div>,
  },
];

const columns = getColumns();

export function SelectableDataTable() {
  const table = useTable(
    {
      columns,
      data,
      enableRowSelection: true,
      features,
    },
    (state) => ({ rowSelection: state.rowSelection }),
  );

  const totalBudget = data.reduce((sum, project) => sum + project.budget, 0);
  const formattedTotal = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(totalBudget);

  return (
    <Frame className="w-full">
      <Table variant="card">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Budget</TableCell>
            <TableCell className="text-right">{formattedTotal}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Frame>
  );
}
