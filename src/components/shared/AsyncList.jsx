import { LoadingRows } from "@/components/shared/PageSkeleton";
import { ErrorState } from "@/components/ui/error-state";

/**
 * Wraps a list of rows with the shared loading, error and
 * empty states. `children` (the rows) render only when there is something to show.
 *
 * @param {object} props
 * @param {Array | undefined} props.items The fetched items (`undefined` until the first load).
 * @param {boolean} props.loading
 * @param {Error | null} props.error
 * @param {() => void} props.onRetry
 * @param {React.ReactNode} props.empty Element shown when the list is empty.
 */
const AsyncList = ({ items, loading, error, onRetry, empty, children }) => {
  if (loading && !items) return <LoadingRows />;

  if (error && !items) {
    return <ErrorState description={error.message} onRetry={onRetry} />;
  }

  if (!items?.length) return empty;

  return <div className="space-y-4 -ml-3 md:-ml-5">{children}</div>;
};

export default AsyncList;
