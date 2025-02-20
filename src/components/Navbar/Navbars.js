"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-transparent top-0 left-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-green-800 hover:text-green-600"
        >
          Astemari
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
