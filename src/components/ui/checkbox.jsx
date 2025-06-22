"use client"

import React from "react"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false)

  const handleChange = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    if (onCheckedChange) {
      onCheckedChange(newChecked)
    }
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      ref={ref}
      className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        isChecked ? "bg-primary text-primary-foreground" : "bg-white"
      } ${className || ""}`}
      onClick={handleChange}
      {...props}
    >
      {isChecked && <Check className="h-3 w-3 text-white" />}
    </button>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
