"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

// Main Navbar Container
export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

// Desktop Navigation Body
export const NavBody = ({ children, className, visible = false }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "blur(8px)",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.1)"
          : "0 0 12px rgba(0, 0, 0, 0.1)",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
        paddingTop: visible ? "8px" : "16px",
        paddingBottom: visible ? "8px" : "16px",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-4 lg:flex",
        visible ? "bg-neutral-900/90" : "bg-neutral-900/70",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Navigation Items
export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-neutral-300 transition duration-200 hover:text-white lg:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={`link-${idx}`}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-300 hover:text-white transition-colors"
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-neutral-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

// Mobile Navigation Container
export const MobileNav = ({ children, className, visible = false }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "blur(8px)",
        boxShadow: visible
          ? "0 0 24px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.1)"
          : "0 0 12px rgba(0, 0, 0, 0.1)",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "16px" : "32px",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-2 lg:hidden",
        visible ? "bg-neutral-900/90" : "bg-neutral-900/70",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Mobile Navigation Header
export const MobileNavHeader = ({ children, className }) => {
  return (
    <div className={cn(
      "flex items-center justify-between w-full px-4 h-full",
      className
    )}>
      {children}
    </div>
  );
};

// Mobile Navigation Toggle Button
export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <X className="w-6 h-6 text-neutral-200 cursor-pointer hover:text-white transition-colors" onClick={onClick} />
  ) : (
    <Menu className="w-6 h-6 text-neutral-200 cursor-pointer hover:text-white transition-colors" onClick={onClick} />
  );
};

// Mobile Navigation Menu
export const MobileNavMenu = ({ children, isOpen, onClose, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-neutral-900/95 px-4 py-8 backdrop-blur-lg shadow-lg border border-neutral-700/50",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Navbar Logo Component
export const NavbarLogo = ({ className, children }) => {
  return (
    <a
      href="/"
      className={cn(
        "flex items-center gap-3 group",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          <img
            src="/images/Cypher-ray_NoText.png"
            alt="CypherRay Logo"
            className="w-8 h-8 group-hover:scale-105 transition-transform duration-200"
          />
          <span className="text-xl font-display font-bold text-white group-hover:text-primary-400 transition-colors duration-200">
            CypherRay
          </span>
        </>
      )}
    </a>
  );
};

// Navbar Button Component
export const NavbarButton = ({
  href,
  as: Tag = "button",
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center text-sm";

  const variantStyles = {
    primary: "bg-white text-black shadow-lg hover:shadow-xl",
    secondary: "bg-transparent border border-neutral-600 hover:border-neutral-400 text-neutral-200 hover:text-white shadow-none",
    dark: "bg-black text-white shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl",
  };

  if (href) {
    return (
      <Tag
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Tag>
  );
};
