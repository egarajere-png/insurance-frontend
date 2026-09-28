import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn } from "../../lib/cn";
import { Skeleton } from "./Skeleton";

export interface Column<T> {
  header: string;
  key: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  errorMessage = "Couldn't load this data. Please try again.",
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
  rowKey,
  onRowClick,
  pageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = data ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const pageData = useMemo(() => {
    if (!data) return [];
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {columns.map((col) => (
                <th key={col.key} className={cn("px-5 py-3 font-medium text-slate-500", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3.5">
                      <Skeleton className="h-4 w-full max-w-[10rem]" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && isError && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-danger-700">
                  {errorMessage}
                </td>
              </tr>
            )}

            {!isLoading && !isError && pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-14">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Inbox className="size-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{emptyTitle}</p>
                    {emptyDescription && <p className="text-sm text-slate-500">{emptyDescription}</p>}
                    {emptyAction}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              pageData.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-brand-50/60"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-5 py-3.5 text-slate-700", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && data && data.length > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} &middot; {data.length} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex size-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
