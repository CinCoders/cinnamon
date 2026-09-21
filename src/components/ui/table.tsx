"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  Csv01Icon,
  Upload04Icon,
  HtmlFileIcon,
  Image01Icon,
  PdfIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  exportElementToPng,
  exportTableToCsv,
  exportTableToHtml,
  exportTableToPdf,
  type TableExportData,
} from "@/lib/tableExport";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TableVariant = "default" | "card";

export type TableProps = React.ComponentProps<"table"> & {
  variant?: TableVariant;
  render?: useRender.ComponentProps<"div">["render"];
  /** Shows the "Exportar" button above the table (CSV, HTML, PDF, PNG). */
  exportEnabled?: boolean;
  /** Data to export as CSV/HTML/PDF. Required when `exportEnabled` is true. */
  exportData?: TableExportData | (() => TableExportData);
  /** Base filename (without extension) used for exported files. */
  exportFileName?: string;
};

function TableExportMenu({
  exportData,
  exportFileName = "table",
  containerRef,
}: {
  exportData?: TableExportData | (() => TableExportData);
  exportFileName?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}): React.ReactElement {
  const getExportData = (): TableExportData =>
    typeof exportData === "function" ? exportData() : (exportData ?? { headers: [], rows: [] });

  return (
    <div className="flex items-center justify-end gap-1 px-1 pt-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button aria-label="Exportar" variant="azul" size="sm">
              <HugeiconsIcon icon={Upload04Icon} size={18} strokeWidth={2} />
              Exportar
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => exportTableToCsv(getExportData(), `${exportFileName}.csv`)}
          >
            <HugeiconsIcon icon={Csv01Icon} strokeWidth={2} />
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportTableToHtml(getExportData(), `${exportFileName}.html`)}
          >
            <HugeiconsIcon icon={HtmlFileIcon} strokeWidth={2} />
            HTML
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportTableToPdf(getExportData(), `${exportFileName}.pdf`)}
          >
            <HugeiconsIcon icon={PdfIcon} strokeWidth={2} />
            PDF
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (containerRef.current) {
                exportElementToPng(containerRef.current, `${exportFileName}.png`);
              }
            }}
          >
            <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />
            PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function Table({
  className,
  variant = "default",
  render,
  exportEnabled = false,
  exportData,
  exportFileName,
  ...props
}: TableProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultProps = {
    children: (
      <table
        className={cn(
          "w-full caption-bottom in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0 text-sm",
          className,
        )}
        data-slot="table"
        {...props}
      />
    ),
    className:
      "relative w-full overflow-x-auto [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border",
    "data-slot": "table-container",
    "data-variant": variant,
    ref: containerRef,
  };

  const table = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, {}),
    render,
  });

  if (!exportEnabled) return table;

  return (
    <div data-slot="table-export-wrapper" className="w-full">
      <TableExportMenu
        containerRef={containerRef}
        exportData={exportData}
        exportFileName={exportFileName}
      />
      {table}
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">): React.ReactElement {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">): React.ReactElement {
  return (
    <tbody
      className={cn(
        "relative in-data-[variant=card]:rounded-xl in-data-[variant=card]:shadow-xs/5 before:pointer-events-none before:absolute before:inset-px not-in-data-[variant=card]:before:hidden before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/8%)] [&_tr:last-child]:border-0 in-data-[variant=card]:*:[tr]:border-0 in-data-[variant=card]:*:[tr]:*:[td]:border-b in-data-[variant=card]:*:[tr]:*:[td]:bg-card in-data-[variant=card]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[variant=card]:*:[tr]:*:[td]:first:border-s in-data-[variant=card]:*:[tr]:first:*:[td]:border-t in-data-[variant=card]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[variant=card]:*:[tr]:*:[td]:last:border-e in-data-[variant=card]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[variant=card]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_4%)] dark:in-data-[variant=card]:*:[tr]:data-[state=selected]:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_4%)] dark:in-data-[variant=card]:*:[tr]:hover:*:[td]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]",
        className,
      )}
      data-slot="table-body"
      {...props}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">): React.ReactElement {
  return (
    <tfoot
      className={cn(
        "border-t in-data-[variant=card]:border-none bg-transparent not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] font-medium dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)] [&>tr]:last:border-b-0",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">): React.ReactElement {
  return (
    <tr
      className={cn(
        "relative border-b not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-black)_2%)] not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-black)_4%)] dark:not-in-data-[variant=card]:data-[state=selected]:bg-[color-mix(in_srgb,var(--background),var(--color-white)_4%)] dark:not-in-data-[variant=card]:hover:bg-[color-mix(in_srgb,var(--background),var(--color-white)_2%)]",
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">): React.ReactElement {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none in-data-[variant=card]:first:ps-4 in-data-[variant=card]:last:pe-4 has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">): React.ReactElement {
  return (
    <td
      className={cn(
        "whitespace-nowrap bg-clip-padding p-2.5 in-data-[slot=table-footer]:py-3.5 align-middle leading-none in-data-[variant=card]:first:ps-4 in-data-[variant=card]:last:pe-4 has-[[role=checkbox]]:w-px last:has-[[role=checkbox]]:ps-0 first:has-[[role=checkbox]]:pe-0",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

export type TableMessageRowProps = React.ComponentProps<"tr"> & {
  /** Number of columns in the table, so the message cell spans the full width. */
  colSpan: number;
};

/**
 * Drop-in replacement for the `<TableRow>`s inside `<TableBody>` for
 * loading/empty/error states — keeps the header and table chrome mounted
 * while showing a single centered message instead of data rows.
 */
export function TableMessageRow({
  colSpan,
  className,
  children,
  ...props
}: TableMessageRowProps): React.ReactElement {
  return (
    <tr data-slot="table-message-row" {...props}>
      <td
        colSpan={colSpan}
        className={cn(
          "h-24 whitespace-normal p-2.5 text-center align-middle text-muted-foreground leading-none",
          className,
        )}
        data-slot="table-cell"
      >
        {children}
      </td>
    </tr>
  );
}

export type TableSkeletonRowsProps = {
  /** Number of columns per row, so each row's skeleton bars match the real header. */
  columns: number;
  /** Number of skeleton rows to render. */
  rows?: number;
};

/**
 * Drop-in replacement for the real `<TableRow>`s inside `<TableBody>` while
 * data is loading — mirrors the row/cell layout so the skeleton doesn't
 * jump when real rows arrive.
 */
export function TableSkeletonRows({
  columns,
  rows = 5,
}: TableSkeletonRowsProps): React.ReactElement {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} data-slot="table-skeleton-row">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <TableCell key={columnIndex}>
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">): React.ReactElement {
  return (
    <caption
      className={cn(
        "in-data-[variant=card]:my-4 mt-4 text-muted-foreground text-sm",
        className,
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}
