import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/ui/logo";
import { useLocation } from "react-router-dom";
import futureBlackImage from "@/assets/future-black.jpeg";

export default function Header() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/loja", label: "Loja" },
  ];

  return (
    <header className="relative bg-transparent">
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>
      <div className="container mx-auto px-4">
        {/* Top navigation */}
        <div className="grid grid-cols-3 items-center h-24">
          {/* Left - Nav links */}
          <nav className="hidden md:flex space-x-8 justify-start">
            {navItems.map(({ href, label }) => (
              <Link key={href} to={href}>
                <span
                  className={`font-rajdhani uppercase text-sm font-medium py-2 transition-colors tracking-wider ${
                    pathname === href
                      ? "text-fury-gold border-b-2 border-fury-gold"
                      : "text-white hover:text-fury-gold"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <Link to="/">
              <Logo className="h-12 w-auto cursor-pointer" />
            </Link>
          </div>

          {/* Right - User/Login */}
          <div className="flex justify-end">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-fury-gold font-rajdhani uppercase text-sm font-medium hover:underline py-2"
                >
                  {user.username}
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-fury-gold rounded shadow-lg z-10">
                    <div className="py-1">
                      <Link to="/profile">
                        <span className="block px-4 py-2 text-white hover:bg-fury-gold hover:text-black">
                          Perfil
                        </span>
                      </Link>
                      {user.isAdmin && (
                        <Link to="/admin">
                          <span className="block px-4 py-2 text-white hover:bg-fury-gold hover:text-black">
                            Admin Dashboard
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-fury-gold hover:text-black"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <span
                  className={`font-rajdhani uppercase text-sm font-medium py-2 tracking-wider ${
                    pathname === "/login"
                      ? "text-fury-gold border-b-2 border-fury-gold"
                      : "text-fury-gold hover:underline"
                  }`}
                >
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex justify-between items-center py-4">
          <Link to="/">
            <Logo className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white focus:outline-none"
          >
            {showMenu ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {showMenu && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-black border-t border-fury-gold z-50">
            <div className="py-2 px-4 space-y-2">
              {navItems.map(({ href, label }) => (
                <Link key={href} to={href}>
                  <span className="block py-2 text-white hover:text-fury-gold font-rajdhani uppercase">
                    {label}
                  </span>
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/profile">
                    <span className="block py-2 text-fury-gold hover:underline font-rajdhani uppercase">
                      Perfil
                    </span>
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin">
                      <span className="block py-2 text-fury-gold hover:underline font-rajdhani uppercase">
                        Admin Dashboard
                      </span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="block py-2 text-fury-gold hover:underline w-full text-left font-rajdhani uppercase"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <span className="block py-2 text-fury-gold hover:underline font-rajdhani uppercase">
                    Login
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hero image */}
      <div className="w-full bg-black">
        <div className="container mx-auto px-4">
          <div className="relative h-[400px] lg:h-[500px] flex items-center  overflow-hidden">
            <img
              src={futureBlackImage}
              alt="FURIA - Future is Black"
              className="max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
