"use client";

import useCart from "@/lib/hooks/useCart";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  CircleUserRound,
  Menu,
  Search,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Heart,
  Package,
  X,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();

  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [query, setQuery] = useState("");

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`transition-all duration-300 hover:text-green-600 ${
        pathname === href
          ? "text-green-600 font-semibold"
          : "text-gray-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* ================= Top Contact Bar ================= */}
      <div className="hidden md:flex justify-between items-center px-10 py-2 bg-green-700 text-white text-sm">
        <div className="flex items-center gap-6">
          <a
            href="tel:0792753931"
            className="flex items-center gap-2 hover:text-yellow-300 transition"
          >
            <Phone size={16} />
            0792753931
          </a>

          <a
            href="mailto:microplug2025@gmail.com"
            className="flex items-center gap-2 hover:text-yellow-300 transition"
          >
            <Mail size={16} />
            microplug2025@gmail.com
          </a>

          <a
            href="https://maps.google.com/maps?q=loc:36.8291508,36.8291508"
            target="_blank"
            className="flex items-center gap-2 hover:text-yellow-300 transition"
          >
            <MapPin size={16} />
            Our Location
          </a>
        </div>

        <span className="text-xs">
          🌿 Welcome to Microplug 
        </span>
      </div>

      {/* ================= Main Navbar ================= */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 via-purple-600 to-blue-500 backdrop-blur-md shadow-md">
        <div className="flex items-center justify-between px-4 md:px-8 lg:px-10 py-3">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/milogo.PNG"
              alt="Logo"
              width={140}
              height={70}
              className="object-contain rounded-sm"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-white">
            {navLink("/", "Home")}

            <Link
              href={user ? "/wishlist" : "/sign-in"}
              className={`flex items-center gap-2 transition hover:text-green-600 ${
                pathname === "/wishlist"
                  ? "text-green-600 font-semibold"
                  : ""
              }`}
            >
              <Heart size={18} />
              Wishlist
            </Link>

            <Link
              href={user ? "/orders" : "/sign-in"}
              className={`flex items-center gap-2 transition hover:text-green-600 ${
                pathname === "/orders"
                  ? "text-green-600 font-semibold"
                  : ""
              }`}
            >
              <Package size={18} />
              Orders
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="flex w-full rounded-full border bg-gray-50 overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  query &&
                  router.push(`/search/${query}`)
                }
                className="flex-1 px-5 py-2 outline-none bg-transparent"
              />

              <button
                disabled={!query}
                onClick={() => router.push(`/search/${query}`)}
                className="bg-green-600 px-5 text-white hover:bg-green-700 transition disabled:bg-gray-300"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="hidden md:flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              <ShoppingCart size={20} />
              <span className="font-medium">
                {cart.cartItems.length}
              </span>
            </Link>

            {/* User */}
            {user ? (
              <UserButton afterSignOutUrl="/sign-in" />
            ) : (
              <Link href="/sign-in">
                <CircleUserRound
                  size={30}
                  className="hover:text-green-600 transition"
                />
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className="lg:hidden"
              onClick={() => setDropdownMenu(!dropdownMenu)}
            >
              {dropdownMenu ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ================= Mobile Menu ================= */}

        {dropdownMenu && (
          <div className="lg:hidden border-t bg-white shadow-xl">
            <div className="flex flex-col p-5 gap-5">

              <div className="flex rounded-full border overflow-hidden">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-4 py-2 outline-none"
                />

                <button
                  onClick={() => router.push(`/search/${query}`)}
                  className="bg-green-600 text-white px-4"
                >
                  <Search size={18} />
                </button>
              </div>

              <Link href="/" onClick={() => setDropdownMenu(false)}>
                Home
              </Link>

              <Link
                href={user ? "/wishlist" : "/sign-in"}
                onClick={() => setDropdownMenu(false)}
              >
                Wishlist
              </Link>

              <Link
                href={user ? "/orders" : "/sign-in"}
                onClick={() => setDropdownMenu(false)}
              >
                Orders
              </Link>

              <Link
                href="/cart"
                onClick={() => setDropdownMenu(false)}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-green-600 hover:text-white transition"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </div>

                <span className="font-semibold">
                  {cart.cartItems.length}
                </span>
              </Link>

              <div className="border-t pt-4 text-sm space-y-3">
                <a
                  href="tel:0792753931"
                  className="flex items-center gap-2"
                >
                  <Phone size={16} />
                  0792753931
                </a>

                <a
                  href="mailto:microplug2025@gmail.com"
                  className="flex items-center gap-2"
                >
                  <Mail size={16} />
                  microplug2025@gmail.com
                </a>

                <a
                  href="https://maps.google.com/maps?q=loc:36.8291508,36.8291508"
                  target="_blank"
                  className="flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Our Location
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;