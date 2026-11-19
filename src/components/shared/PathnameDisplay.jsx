import { useLocation } from "react-router-dom";

/** Mono eyebrow showing the current path, shown above every page title. */
export default function PathnameDisplay() {
  const { pathname } = useLocation();

  return <p className="eyebrow text-muted-foreground/50 mb-4">{pathname}</p>;
}
