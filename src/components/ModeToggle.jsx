"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  useModeAnimation,
  ThemeAnimationType,
} from "react-theme-switch-animation";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 3,
    duration: 750,
    easing: "ease-in-out",
    // Sync library state with our theme state
    isDarkMode: theme === "dark",
    // When library toggles, update our theme state
    onDarkModeChange: (isDark) => {
      setTheme(isDark ? "dark" : "light");
    },
  });

  const handleToggle = () => {
    // Use library's toggle function which handles animation
    toggleSwitchTheme();
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full w-10 h-10 transition-all duration-200 hover:bg-muted/50 relative overflow-hidden group active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300 relative z-10" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300 relative z-10" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
