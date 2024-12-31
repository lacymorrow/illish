"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

// Dummy data structure
const tocData = [
  { id: "1", title: "Introduction", children: [] },
  {
    id: "2",
    title: "Getting Started",
    children: [
      { id: "2.1", title: "Installation", children: [] },
      { id: "2.2", title: "Configuration", children: [] },
    ],
  },
  {
    id: "3",
    title: "Core Concepts",
    children: [
      { id: "3.1", title: "Components", children: [] },
      { id: "3.2", title: "Hooks", children: [] },
      { id: "3.3", title: "State Management", children: [] },
    ],
  },
  {
    id: "4",
    title: "Advanced Topics",
    children: [
      { id: "4.1", title: "Server-Side Rendering", children: [] },
      { id: "4.2", title: "Performance Optimization", children: [] },
    ],
  },
  { id: "5", title: "Conclusion", children: [] },
];

type TocItem = {
  id: string;
  title: string;
  children: TocItem[];
};

export const TableOfContents = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const renderTocItem = (item: TocItem, depth = 0) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className={`my-1 ${depth > 0 ? "ml-4" : ""}`}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveItem(item.id)}
        className={`flex w-full items-center rounded-md px-2 py-1 text-left transition-colors ${
          activeItem === item.id
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        {item.children.length > 0 && (
          <ChevronRight
            className={`mr-1 h-4 w-4 transition-transform ${
              activeItem === item.id ? "rotate-90" : ""
            }`}
          />
        )}
        <span className="text-sm">{item.title}</span>
      </motion.button>
      {item.children.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: activeItem === item.id ? 1 : 0,
            height: activeItem === item.id ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {item.children.map((child) => renderTocItem(child, depth + 1))}
        </motion.ul>
      )}
    </motion.li>
  );

  return (
    <nav className="w-64 rounded-lg bg-background p-4 text-foreground shadow-md">
      <h2 className="mb-4 text-lg font-semibold">Table of Contents</h2>
      <ul>{tocData.map((item) => renderTocItem(item))}</ul>
    </nav>
  );
};

export function TableOfContentsComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <TableOfContents />
    </div>
  );
}
