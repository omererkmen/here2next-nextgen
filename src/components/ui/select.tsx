import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectContextType {
  value: string
  label: string
  onValueChange: (value: string, label: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
)

function useSelect() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select component")
  }
  return context
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
}

function Select({
  value: controlledValue,
  onValueChange,
  defaultValue = "",
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue
  )
  const [label, setLabel] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const isControlled = controlledValue !== undefined

  const value = isControlled ? controlledValue : uncontrolledValue
  const setValue = (newValue: string, newLabel: string) => {
    setLabel(newLabel)
    if (onValueChange) {
      onValueChange(newValue)
    }
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{ value, label, onValueChange: setValue, isOpen, setIsOpen }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect()

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1B3A7B] focus:border-[#1B3A7B] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <svg
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

interface SelectValueProps {
  placeholder?: string
}

function SelectValue({ placeholder = "Select an option" }: SelectValueProps) {
  const { value, label } = useSelect()
  const displayText = label || value

  return <span className={displayText ? 'text-gray-900' : 'text-gray-600'}>{displayText || placeholder}</span>
}
SelectValue.displayName = "SelectValue"

interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = useSelect()
    const internalRef = React.useRef<HTMLDivElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (resolvedRef.current && !resolvedRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener("click", handleClickOutside)
      }

      return () => {
        document.removeEventListener("click", handleClickOutside)
      }
    }, [isOpen, setIsOpen, resolvedRef])

    if (!isOpen) return null

    return (
      <div
        ref={resolvedRef}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect()
    const isSelected = selectedValue === value

    const handleClick = () => {
      const labelText = typeof children === 'string' ? children : value
      onValueChange(value, labelText)
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-gray-900 outline-none hover:bg-slate-100 focus:bg-slate-100",
          isSelected && "bg-slate-100",
          className
        )}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
