import PathnameDisplay from "./PathnameDisplay";

/** Page title block: path eyebrow, title, and an optional supporting sentence. */
const PageHeader = ({ title, description, children }) => (
  <header className="mb-12">
    <PathnameDisplay />
    <h1 className="font-sans text-heading-32 sm:text-heading-48 font-[450] tracking-[-0.05em] text-foreground">
      {title}
    </h1>
    {description && <p className="mt-2 body-text">{description}</p>}
    {children}
  </header>
);

export default PageHeader;
