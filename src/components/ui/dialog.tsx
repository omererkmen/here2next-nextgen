import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined
)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog component")
  }
  return context
}

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useDialog()

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
DialogTrigger.displayName = "DialogTrigger"

interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useDialog()

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

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
        <div
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 dark:border-slate-800 dark:bg-slate-950",
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
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const { setOpen } = useDialog()

    return (
      <button
        ref={ref}
        onClick={(e) => {
          setOpen(false)
          onClick?.(e)
        }}
        className={className}
        {...props}
      />
    )
  }
)
DialogClose.displayName = "DialogClose"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
