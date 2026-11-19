import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "next-themes";
import { ThemeAnimationType, useModeAnimation } from "react-theme-switch-animation";
import { Button } from "@/components/ui/button";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.CIRCLE,
    duration: 650,
    isDarkMode: resolvedTheme === "dark",
    onDarkModeChange: (isDark) => setTheme(isDark ? "dark" : "light"),
  });

  useEffect(() => setMounted(true), []);

  // The resolved theme is unknown until mounted; render nothing to avoid a wrong icon.
  if (!mounted) return null;

  return (
    <Button
      ref={ref}
      type="button"
      onClick={toggleSwitchTheme}
      variant="ghost"
      size="icon-sm"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className="text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {resolvedTheme === "dark" ? <BsSun className="size-3.5" /> : <BsMoon className="size-3.5" />}
    </Button>
  );
};

export default ModeToggle;
