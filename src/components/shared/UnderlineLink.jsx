import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/**
 * Link whose underline grows from the left on hover.
 * Meant to be wrapped by `<Button asChild variant="link">` so it picks up button styling.
 */
export const UnderlineLink = forwardRef(function UnderlineLink(
  { children, className, underlineClassName, ...props },
  ref,
) {
  return (
    <MotionLink
      ref={ref}
      initial="rest"
      whileHover="hover"
      className={cn("relative inline-flex", className)}
      {...props}
    >
      <span>{children}</span>
      <motion.span
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "pointer-events-none absolute bottom-0 h-px origin-left bg-current",
          underlineClassName ?? "inset-x-0",
        )}
      />
    </MotionLink>
  );
});
