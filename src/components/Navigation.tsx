
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile"; 
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth"; 
import UserMenu from "@/components/UserMenu";
import { cn } from "@/lib/utils";

// Configure your navigation items here
const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Activities", path: "/activities" },
  { label: "Points of Interest", path: "/points-of-interest" }, // New item
  { label: "Market", path: "/market" },
  { label: "Transportation", path: "/transportation" },
];

export default function Navigation({ className }: { className?: string }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { user, isLoading } = useAuth();

  // Only show the navigation bar after determining auth state
  const [showNav, setShowNav] = useState(false);

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setShowNav(!isLoading);
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showNav) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent",
        mobileMenuOpen && "bg-white",
        className
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center group text-xl lg:text-2xl font-bold font-display"
        >
          <span
            className={cn(
              "transition-colors duration-300",
              scrolled || mobileMenuOpen
                ? "text-ocean"
                : "text-white"
            )}
          >
            Discover
          </span>
          <span
            className={cn(
              "transition-colors duration-300",
              scrolled || mobileMenuOpen
                ? "text-coral"
                : "text-white"
            )}
          >
            Diani
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center">
            {user && (
              <UserMenu
                className={cn(
                  "mr-2",
                  scrolled || mobileMenuOpen
                    ? "text-gray-800"
                    : "text-white"
                )}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                scrolled || mobileMenuOpen
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              )}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-1 items-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300",
                    isCurrentPath(item.path)
                      ? scrolled
                        ? "text-ocean bg-blue-50"
                        : "text-white bg-white/20"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <UserMenu
                  className={
                    scrolled ? "text-gray-800" : "text-white"
                  }
                />
              ) : (
                <>
                  <Button
                    asChild
                    variant={scrolled ? "outline" : "ghost"}
                    className={
                      scrolled
                        ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                        : "text-white border-white/30 hover:bg-white/10"
                    }
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className={
                      scrolled
                        ? "bg-ocean hover:bg-ocean-dark text-white"
                        : "bg-white text-ocean hover:bg-white/90"
                    }
                  >
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-in slide-in-from-top-5">
          <div className="container mx-auto px-4 pt-2 pb-4">
            <nav className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md",
                    isCurrentPath(item.path)
                      ? "text-ocean bg-blue-50"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-ocean">
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
