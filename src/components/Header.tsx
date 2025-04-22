"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Morning", path: "/morning" },
  { label: "Workout", path: "/workout" },
  { label: "Journal", path: "/journal" },
  { label: "Night", path: "/night" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 bg-gray-800 text-white justify-center">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`px-3 py-1 rounded ${
            pathname === item.path ? "bg-white text-black" : "hover:bg-gray-700"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
