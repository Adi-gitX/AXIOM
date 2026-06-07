import { createContext, useContext, useEffect } from "react"

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
})

export function ThemeProvider({
    children,
    ...props
}) {
    // Theme is permanently locked to "light" — AXIOM is a single-theme app
    // matching the painterly Duna aesthetic. Dark mode is intentionally disabled.
    const theme = "light"
    const setTheme = () => {}

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("dark")
        root.classList.add("light")
        // Clear any stale theme from previous installs
        try { localStorage.removeItem("vite-ui-theme"); } catch { /* ignore */ }
        try { localStorage.removeItem("axiom-theme-v2"); } catch { /* ignore */ }
    }, [])

    const value = { theme, setTheme }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
