"use client";
import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarDemo() {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Canvas",
      href: "/canvas",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden border-r border-neutral-900 bg-gray-100 transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-900",
        "hover:w-64",
        open ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex flex-1 flex-col justify-between gap-6 px-2 py-6">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} labelVisible={open} />
            ))}
          </div>
        </div>
        <SidebarLink
          link={{
            label: "Manu Arora",
            href: "#",
            icon: (
              <img
                src="https://assets.aceternity.com/manu.png"
                className="h-7 w-7 shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
            ),
          }}
          labelVisible={open}
        />
      </div>
    </div>
  );
}

export const Logo = () => (
  <a
    href="#"
    className="flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-5 w-6 rounded bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-nowrap font-medium"
    >
      TheWrap.
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a href="#" className="flex items-center py-1">
    <div className="h-5 w-6 rounded bg-black dark:bg-white" />
  </a>
);

export interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarLinkProps {
  link: Links;
  className?: string;
  labelVisible?: boolean;
}

export function SidebarLink({ link, className, labelVisible = true }: SidebarLinkProps) {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-800",
        className
      )}
    >
      {link.icon}
      {labelVisible && <span>{link.label}</span>}
    </a>
  );
}
