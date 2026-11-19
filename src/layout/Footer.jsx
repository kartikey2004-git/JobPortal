export default function Footer() {
  return (
    <footer className="w-full bg-background">
      <section className="border-t border-border/60 py-12 sm:py-16">
        <div className="section-shell">
          <blockquote>
            <p className="max-w-2xl text-heading-24 font-[450] leading-snug sm:text-heading-32">
              &ldquo;Connecting the best talent with the most innovative companies.&rdquo;
            </p>

            <div className="mt-5 flex items-center justify-between sm:mt-6">
              <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
              <span className="text-sm font-medium text-muted-foreground">JobConnect</span>
            </div>
          </blockquote>
        </div>
      </section>
    </footer>
  );
}
