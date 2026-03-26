import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
  side: "left" | "right"
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined
)

function useSheet() {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet component")
  }
  return context
}

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  side?: "left" | "right"
  children: React.ReactNode
}

function Sheet({
  open: controlledOpen,
  onOpenChange,
  side = "right",
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined

  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    }
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
  }

  return (
    <SheetContext.Provider value={{ open, setOpen, side }}>
      {children}
    </SheetContext.Provider>
  )
}

interface SheetTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useSheet()

    return (
      <button
        ref={ref}
        onClick={(e) => {
          setOpen(true)
          onClick?.(e)
        }}
        className={className}
        {...props}
      />
    )
  }
)
SheetTrigger.displayName = "SheetTrigger"

interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, side } = useSheet()

    React.useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscapeKey)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscapeKey)
        document.body.style.overflow = ""
      }
    }, [open, setOpen])

    if (!open) return null

    const sideClasses =
      side === "left"
        ? "left-0 translate-x-0 data-[state=open]:-translate-x-full"
        : "right-0 translate-x-0 data-[state=open]:translate-x-full"

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
        <div
          ref={ref}
          className={cn(
            `fixed top-0 z-50 h-full w-3/4 border border-slate-200 bg-white p-6 shadow-lg transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-950 sm:max-w-sm`,
            side === "left" ? "left-0" : "right-0",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)
SheetContent.displayName = "SheetContent"

export { Sheet, SheetTrigger, SheetContent }
