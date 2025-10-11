import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="px-16 py-4 bg-neutral-100 flex justify-between items-center">
      <Link href="/" className="text-2xl text-neutral-800 font-bold">
        Lodestone
      </Link>
      <button className="px-4 py-2 bg-neutral-200 rounded-sm text-neutral-800">
        Login
      </button>
    </nav>
  );
}
