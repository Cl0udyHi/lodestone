import Link from "next/link";
import React from "react";
import { Button } from "./shadcn-ui/button";

export default function Navbar() {
  return (
    <nav className="px-16 py-4 bg-neutral-100 sticky top-0 z-[1000] flex justify-between items-center">
      <Link href="/" className="text-2xl text-neutral-800 font-bold">
        Lodestone
      </Link>
      <Button>Login</Button>
    </nav>
  );
}
