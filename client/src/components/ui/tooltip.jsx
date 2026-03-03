import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipContext = React.createContext(null);

const compose = (theirHandler, ourHandler) => (event) => {
  try {
    theirHandler?.(event);
  } finally {
    if (!event.defaultPrevented) {
      ourHandler?.(event);
    }
  }
};

function TooltipProvider({ children }) {
  return <>{children}</>;
}

function Tooltip({ children }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <TooltipContext.Provider value={value}>
      <span className="relative inline-flex">{children}</span>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ asChild = false, children }) {
  const context = React.useContext(TooltipContext);
  if (!context) return children;

  const { setOpen } = context;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onMouseEnter: compose(children.props.onMouseEnter, handleOpen),
      onMouseLeave: compose(children.props.onMouseLeave, handleClose),
      onFocus: compose(children.props.onFocus, handleOpen),
      onBlur: compose(children.props.onBlur, handleClose),
    });
  }

  return (
    <span
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {children}
    </span>
  );
}

function TooltipContent({ children, side = "top", className }) {
  const context = React.useContext(TooltipContext);
  if (!context?.open) return null;

  const sideClasses = side === "bottom"
    ? "top-full mt-2"
    : side === "left"
      ? "right-full mr-2 top-1/2 -translate-y-1/2"
      : side === "right"
        ? "left-full ml-2 top-1/2 -translate-y-1/2"
        : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md whitespace-nowrap",
        sideClasses,
        className
      )}
    >
      {children}
    </span>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
