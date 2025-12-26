import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

// Context
const ExpandableScreenContext = createContext(null)

function useExpandableScreen() {
    const context = useContext(ExpandableScreenContext)
    if (!context) {
        throw new Error(
            "useExpandableScreen must be used within an ExpandableScreen"
        )
    }
    return context
}

// Root Component
export function ExpandableScreen({
    children,
    defaultExpanded = false,
    onExpandChange,
    layoutId = "expandable-card",
    triggerRadius = "100px",
    contentRadius = "24px",
    animationDuration = 0.3,
    lockScroll = true,
}) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const expand = () => {
        setIsExpanded(true)
        onExpandChange?.(true)
    }

    const collapse = () => {
        setIsExpanded(false)
        onExpandChange?.(false)
    }

    useEffect(() => {
        if (lockScroll) {
            if (isExpanded) {
                // Prevent scrolling on both body and html to handle different browsers/devices
                document.body.style.overflow = "hidden"
                document.documentElement.style.overflow = "hidden"
            } else {
                document.body.style.overflow = ""
                document.documentElement.style.overflow = ""
            }
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = ""
            document.documentElement.style.overflow = ""
        }
    }, [isExpanded, lockScroll])

    return (
        <ExpandableScreenContext.Provider
            value={{
                isExpanded,
                expand,
                collapse,
                layoutId,
                triggerRadius,
                contentRadius,
                animationDuration,
            }}
        >
            {children}
        </ExpandableScreenContext.Provider>
    )
}

// Trigger Component
export function ExpandableScreenTrigger({
    children,
    className = "",
}) {
    const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen()

    return (
        <AnimatePresence initial={false}>
            {!isExpanded && (
                <motion.div className={`inline-block relative ${className}`}>
                    {/* Background layer with shared layoutId for morphing */}
                    <motion.div
                        style={{
                            borderRadius: triggerRadius,
                        }}
                        layout
                        layoutId={layoutId}
                        className="absolute inset-0 transform-gpu will-change-transform"
                    />
                    {/* Content layer that fades out on expand */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout={false}
                        onClick={expand}
                        className="relative cursor-pointer"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Content Component
export function ExpandableScreenContent({
    children,
    className = "",
    showCloseButton = true,
    closeButtonClassName = "",
}) {
    const { isExpanded, collapse, layoutId, contentRadius, animationDuration } =
        useExpandableScreen()

    // Portal requires the component to return null if not expanded (or handle Conditional Rendering)
    // Here we conditionally render the Portal content
    if (!isExpanded) return null;

    return createPortal(
        <AnimatePresence mode="sync">
            {isExpanded && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-2 isolate">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[-1]"
                        onClick={collapse}
                    />
                    {/* Morphing background with shared layoutId */}
                    <motion.div
                        layoutId={layoutId}
                        transition={{ duration: animationDuration, ease: [0.32, 0.72, 0, 1] }}
                        style={{
                            borderRadius: contentRadius,
                        }}
                        className={`relative flex h-full w-full overflow-y-auto transform-gpu will-change-transform ${className}`}
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="relative z-20 w-full"
                        >
                            {children}
                        </motion.div>

                        {showCloseButton && (
                            <motion.button
                                onClick={collapse}
                                className={`absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center transition-colors rounded-full ${closeButtonClassName ||
                                    "text-white bg-transparent hover:bg-white/10"
                                    }`}
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

// Background Component (optional)
export function ExpandableScreenBackground({
    trigger,
    content,
    className = "",
}) {
    const { isExpanded } = useExpandableScreen()

    if (isExpanded && content) {
        return <div className={className}>{content}</div>
    }

    if (!isExpanded && trigger) {
        return <div className={className}>{trigger}</div>
    }

    return null
}

export { useExpandableScreen }
