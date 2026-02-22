import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-6 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            JobConnect
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />

          <SignedOut>
            <Button
              onClick={() => setShowSignIn(true)}
              variant="outline"
              size="sm"
              className="font-medium"
            >
              Log in
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="default" size="sm" className="hidden sm:flex gap-2">
                  <PenBox className="h-4 w-4" />
                  Post Job
                </Button>
                <Button variant="default" size="icon" className="sm:hidden rounded-full h-8 w-8">
                  <PenBox className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border border-border hover:opacity-80 transition-opacity",
                  userButtonPopoverMain: "border border-border shadow-xl",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label={user?.unsafeMetadata?.role === "candidate" ? "My Applications" : "Posted Jobs"}
                  labelIcon={<BriefcaseBusiness className="h-4 w-4" />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart className="h-4 w-4" />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[100] flex justify-center items-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="animate-in zoom-in-95 duration-200">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

