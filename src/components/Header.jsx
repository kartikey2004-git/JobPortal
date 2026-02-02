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

const Header = () => {
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const [showSignIn, setShowSignIn] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-6 flex justify-between items-center border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <Link>
          <h1 className="text-2xl md:text-3xl font-semibold cursor-pointer tracking-tight hover:text-primary transition-colors duration-150">
            JobConnect
          </h1>
        </Link>
        <div className="flex gap-8">
          <SignedOut>
            <Button
              onClick={() => setShowSignIn(true)}
              variant="outline"
              className=""
            >
              Sign in
            </Button>
          </SignedOut>

          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                {user?.unsafeMetadata?.role === "candidate" ? (
                  <UserButton.Link
                    label="Applications"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  ></UserButton.Link>
                ) : (
                  <UserButton.Link
                    label="Posted Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  ></UserButton.Link>
                )}
              </UserButton.MenuItems>

              <UserButton.MenuItems>
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                ></UserButton.Link>
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/10 backdrop-blur-sm overflow-auto transition-opacity duration-200"
        >
          <div className="p-4 rounded-xl max-w-md w-full">
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
