import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ShareButton = ({ className, links, children, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        className={cn(
          "relative min-w-40 rounded-lg",
          "bg-card border-border",
          "hover:bg-accent/50",
          "text-foreground",
          "border shadow-soft",
          "transition-all duration-150",
          isHovered ? "opacity-0 scale-95" : "opacity-100 scale-100",
          className,
        )}
        {...props}
      >
        <span className="flex items-center gap-2">{children}</span>
      </Button>
      <div className="absolute left-0 top-0 flex h-10">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <button
              type="button"
              key={index}
              onClick={link.onClick}
              className={cn(
                "h-10",
                "w-10",
                "flex items-center justify-center",
                "bg-primary text-primary-foreground",
                "transition-all duration-150",
                index === 0 && "rounded-l-lg",
                index === links.length - 1 && "rounded-r-lg",
                "border-r border-border last:border-r-0",
                "hover:bg-primary/90 active:bg-primary/95",
                "shadow-soft",
                isHovered
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0",
                index === 0 && "transition-all duration-150",
                index === 1 && "delay-50 transition-all duration-150",
                index === 2 && "transition-all delay-100 duration-150",
                index === 3 && "transition-all delay-150 duration-150",
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShareButton;
