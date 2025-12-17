"use client"

import React, { useState, useEffect, useRef, createContext, useContext } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Context for dropdown state
const DropdownContext = createContext(null)

function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, dropdownRef }}>
      <div className="relative w-fit" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

function DropdownMenuTrigger({ children, className, asChild, ...props }) {
  const { isOpen, setIsOpen } = useContext(DropdownContext)

  const handleClick = () => setIsOpen(!isOpen)

  // If asChild is true, clone the child and add onClick
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    })
  }

  return (
    <button
      onClick={handleClick}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({ children, className, align = "end", ...props }) {
  const { isOpen } = useContext(DropdownContext)

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ 
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : -10,
        scale: isOpen ? 1 : 0.95
      }}
      transition={{ duration: 0.2 }}
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
      className={cn(
        "absolute mt-2 min-w-32 rounded-2xl bg-white shadow-lg border border-dark/20  z-50 overflow-hidden",
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </motion.div>
  )
}

function DropdownMenuItem({ children, className, onClick, variant = "default", disabled, asChild, ...props }) {
  const { setIsOpen } = useContext(DropdownContext)

  const handleClick = (e) => {
    if (disabled) return
    onClick?.(e)
    setIsOpen(false)
  }

  const variantClasses = {
    default: "hover:bg-dark/5 ",
    destructive: "text-red-600 "
  }

  // If asChild is true, clone the child and add onClick
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className: cn(
        "w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-dark text-sm font-medium",
        "disabled:opacity-50 disabled:pointer-events-none",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variantClasses[variant],
        className,
        children.props.className
      ),
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 text-dark text-sm font-medium",
        "disabled:opacity-50 disabled:pointer-events-none",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn("h-px bg-dark/5  my-1", className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({ children, className, ...props }) {
  return (
    <div
      className={cn("px-3 py-2 text-xs font-semibold text-dark/50 ", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuGroup({ children, className, ...props }) {
  return (
    <div className={cn("py-1", className)} {...props}>
      {children}
    </div>
  )
}

// Legacy exports for backward compatibility
const DropdownMenuPortal = ({ children }) => children
const DropdownMenuCheckboxItem = DropdownMenuItem
const DropdownMenuRadioGroup = DropdownMenuGroup
const DropdownMenuRadioItem = DropdownMenuItem
const DropdownMenuShortcut = ({ children, className, ...props }) => (
  <span className={cn("ml-auto text-xs text-dark/50", className)} {...props}>
    {children}
  </span>
)
const DropdownMenuSub = DropdownMenu
const DropdownMenuSubTrigger = DropdownMenuItem
const DropdownMenuSubContent = DropdownMenuContent

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
