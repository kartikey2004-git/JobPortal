import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder list rows shown while a list loads. */
export function LoadingRows({ count = 3 }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Full-page loading state: header placeholder followed by list rows. */
export default function PageSkeleton({ count = 3 }) {
  return (
    <div className="page-shell">
      <div className="mb-12 space-y-3" aria-hidden="true">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <LoadingRows count={count} />
    </div>
  );
}
