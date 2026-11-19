import { SignIn, useUser, UserButton } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES, SIGN_IN_PARAM } from "@/config/constants";
import ModeToggle from "@/features/theme/ModeToggle";
import useUserRole from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 20;

const NavLink = ({ to, children, className }) => (
  <Link
    to={to}
    className={cn(
      "group relative py-2 text-copy-14 font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground",
      className,
    )}
  >
    <span>{children}</span>
    <span className="pointer-events-none absolute -inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
  </Link>
);

export function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSignedIn } = useUser();
  const { isCandidate, isRecruiter } = useUserRole();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openedByButton, setOpenedByButton] = useState(false);

  // The overlay opens from the button or from the `?sign-in=true` param (set by ProtectedRoute).
  const showSignIn = openedByButton || Boolean(searchParams.get(SIGN_IN_PARAM));

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSignIn = () => {
    setOpenedByButton(false);
    setSearchParams({});
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) closeSignIn();
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-(--z-sticky) w-full transition-all duration-500",
          mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <div
          className={cn(
            "w-full backdrop-blur-xl transition-all duration-500 ease-out",
            scrolled ? "bg-background/95" : "bg-background/80",
          )}
        >
          <div className="section-shell flex h-14 items-center justify-between sm:h-16">
            <nav className="flex items-center gap-3 sm:gap-5 lg:gap-6">
              <Link
                to={ROUTES.HOME}
                className="py-2 text-copy-14 font-medium text-foreground transition-opacity hover:opacity-65"
              >
                JobConnect
              </Link>
              <NavLink to={ROUTES.JOBS}>Jobs</NavLink>
              {isSignedIn && <NavLink to={ROUTES.SAVED_JOBS}>Saved</NavLink>}
              {isRecruiter && (
                <NavLink to={ROUTES.POST_JOB} className="hidden sm:block">
                  Post a job
                </NavLink>
              )}
              {isSignedIn && (
                <NavLink to={ROUTES.MY_JOBS} className="hidden sm:block">
                  {isCandidate ? "Applications" : "Listings"}
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ModeToggle />

              {isSignedIn === false && (
                <Button onClick={() => setOpenedByButton(true)} variant="outline" size="sm">
                  Log in
                </Button>
              )}

              {isSignedIn && (
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label={isCandidate ? "My Applications" : "Posted Jobs"}
                      labelIcon={<BriefcaseBusiness className="size-4" />}
                      href={ROUTES.MY_JOBS}
                    />
                    <UserButton.Link
                      label="Saved Jobs"
                      labelIcon={<Heart className="size-4" />}
                      href={ROUTES.SAVED_JOBS}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSignIn && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
        >
          <div className="animate-in zoom-in-95 duration-200">
            <SignIn
              signUpForceRedirectUrl={ROUTES.ONBOARDING}
              fallbackRedirectUrl={ROUTES.ONBOARDING}
            />
          </div>
        </div>
      )}
    </>
  );
}
