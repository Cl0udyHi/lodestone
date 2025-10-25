import Link from "next/link";
import React from "react";
import { Button } from "./ui/shadcn-ui/button";

export default function Navbar() {
  return (
    <nav className="px-16 py-4 bg-neutral-100 sticky top-0 z-[1000] flex justify-between items-center">
      <Link href="/" className="text-2xl text-neutral-800 font-bold">
        Lodestone
      </Link>
      <Button className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-base rounded-full">
        Login
      </Button>
    </nav>
  );
}
