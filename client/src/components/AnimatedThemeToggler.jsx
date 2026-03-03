import React, { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "../lib/utils";
import { useTheme } from "./theme-provider";

const resolveIsDark = (theme) => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const AnimatedThemeToggler = ({ className, duration = 400, ...props }) => {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        setIsDark(resolveIsDark(theme));
    }, [theme]);

    useEffect(() => {
        if (theme !== "system") return undefined;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const update = () => setIsDark(media.matches);
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, [theme]);

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;
        const nextTheme = isDark ? "light" : "dark";

        // Fallback if view transitions are not supported
        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme);
            });
        }).ready;

        const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    }, [duration, isDark, setTheme]);

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn("relative p-2 rounded-full hover:bg-muted transition-colors", className)}
            {...props}
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};
