"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const locations = [
  { name: "Smithfield", href: "/locations/smithfield" },
  { name: "Soho", href: "/locations/soho" },
  { name: "Mayfair", href: "/locations/mayfair" },
  { name: "Birmingham", href: "/locations/birmingham" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-black p-4 fixed w-full top-0 left-0 z-[10000]">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src={"/white-logo.png"}
            alt="Karaoke Box Logo"
            className="w-12"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/experience"
            className={`text-white hover:text-fuchsia-400 ${
              isActive("/experience") ? "text-fuchsia-400" : ""
            }`}
          >
            Your Experience
          </Link>
          <Link
            href="/about"
            className={`text-white hover:text-fuchsia-400 ${
              isActive("/about") ? "text-fuchsia-400" : ""
            }`}
          >
            About
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-white hover:text-fuchsia-400 flex items-center focus:outline-none ${
                locations.some((location) => isActive(location.href))
                  ? "text-fuchsia-400"
                  : ""
              }`}
            >
              Our Locations <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {isOpen && (
              <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {locations.map((location) => (
                    <Link
                      key={location.name}
                      href={location.href}
                      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                        isActive(location.href)
                          ? "bg-gray-100 text-gray-900"
                          : ""
                      }`}
                      role="menuitem"
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/songs"
            className={`text-white hover:text-fuchsia-400 ${
              isActive("/songs") ? "text-fuchsia-400" : ""
            }`}
          >
            Songs
          </Link>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
            BOOK NOW
          </Button>
        </div>
        <Button
          className="md:hidden bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/experience"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/experience")
                  ? "text-fuchsia-400"
                  : "text-white hover:text-gray-300"
              }`}
            >
              Your Experience
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/about")
                  ? "text-fuchsia-400"
                  : "text-white hover:text-fuchsia-400"
              }`}
            >
              About
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-white hover:text-fuchsia-400 flex items-center focus:outline-none px-3 py-2 rounded-md text-base font-medium w-full ${
                  locations.some((location) => isActive(location.href))
                    ? "text-fuchsia-400"
                    : ""
                }`}
              >
                Our Locations <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isOpen && (
                <div className="px-3 py-2">
                  {locations.map((location) => (
                    <Link
                      key={location.name}
                      href={location.href}
                      className={`block py-2 text-sm ${
                        isActive(location.href)
                          ? "text-fuchsia-400"
                          : "text-white hover:text-fuchsia-400"
                      }`}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/songs"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/songs")
                  ? "text-fuchsia-400"
                  : "text-white hover:text-fuchsia-400"
              }`}
            >
              Songs
            </Link>
            <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-full mt-4">
              <Calendar className="mr-2 h-4 w-4" />
              BOOK NOW
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
