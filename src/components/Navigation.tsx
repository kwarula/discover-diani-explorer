import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile"; 
import { Menu, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth"; 
import UserMenu from "@/components/UserMenu";
import { cn } from "@/lib/utils";

// Configure your navigation items here
const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Activities", path: "/activities" },
  { label: "Market", path: "/market" },
];

export default function Navigation({ className }: { className?: string }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const isMobile = useMobile();
  const { user, isLoading } = useAuth();
  
  // Add a local state to handle loading timeout
  const [showAuthUI, setShowAuthUI] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  
  // Force show auth UI after a timeout to prevent endless loading
  useEffect(() => {
    const uiTimer = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout reached in Navigation component');
        setShowAuthUI(true);
      }
    }, 3000); // 3 seconds max wait time
    
    // Show troubleshoot button after longer timeout
    const troubleshootTimer = setTimeout(() => {
      if (isLoading) {
        setShowTroubleshoot(true);
      }
    }, 5000); // 5 seconds for troubleshoot button
    
    if (!isLoading) {
      setShowAuthUI(true);
      setShowTroubleshoot(false);
    }
    
    return () => {
      clearTimeout(uiTimer);
      clearTimeout(troubleshootTimer);
    };
  }, [isLoading]);

  const isCurrentPath = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Close mobile menu when changing location
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

  // Add escape key handler to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  // Render auth UI based on loading state and the timeout
  const renderAuthUI = () => {
    if (isLoading && !showAuthUI) {
      return (
        <div className="flex items-center">
          <Loader2 className={cn(
            "h-5 w-5 animate-spin mr-2",
            scrolled ? "text-gray-500" : "text-white"
          )} />
          {showTroubleshoot && (
            <Link to="/auth/debug">
              <Button 
                size="sm" 
                variant="link" 
                className={cn(
                  "text-xs px-1",
                  scrolled ? "text-gray-500" : "text-white/80"
                )}
              >
                Issues?
              </Button>
            </Link>
          )}
        </div>
      );
    }
    
    if (user) {
      return (
        <UserMenu
          className={
            scrolled ? "text-gray-800" : "text-white"
          }
        />
      );
    }
    
    return (
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
    );
  };

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
          className="flex items-center group relative transition-transform duration-300 hover:scale-105"
        >
          {!logoLoaded && !logoError && (
            <div className="h-10 md:h-12 w-32 bg-white/20 animate-pulse rounded"></div>
          )}
          <img 
            src="/images/discover_diani_website_logo.png" 
            alt="Discover Diani" 
            className={cn(
              "h-10 md:h-12 w-auto transition-all duration-300",
              scrolled || mobileMenuOpen 
                ? "filter-none" 
                : "brightness-[1.2]",
              !logoLoaded && "opacity-0 absolute",
              logoError && "hidden"
            )}
            onLoad={() => setLogoLoaded(true)}
            onError={() => {
              setLogoError(true);
              setLogoLoaded(true);
            }}
          />
          {logoError && (
            <span className="text-xl font-bold text-white">Discover Diani</span>
          )}
        </Link>

        {isMobile ? (
          <div className="flex items-center">
            {isLoading && !showAuthUI ? (
              <div className="mr-2 flex items-center">
                <Loader2 className={cn(
                  "h-5 w-5 animate-spin",
                  scrolled || mobileMenuOpen
                    ? "text-gray-500"
                    : "text-white"
                )} />
                {showTroubleshoot && (
                  <Link to="/auth/debug">
                    <Button 
                      size="sm" 
                      variant="link" 
                      className={cn(
                        "text-xs px-1",
                        scrolled || mobileMenuOpen ? "text-gray-500" : "text-white/80"
                      )}
                    >
                      Issues?
                    </Button>
                  </Link>
                )}
              </div>
            ) : user ? (
              <UserMenu
                className={cn(
                  "mr-2",
                  scrolled || mobileMenuOpen
                    ? "text-gray-800"
                    : "text-white"
                )}
              />
            ) : (
              <div className="mr-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      scrolled || mobileMenuOpen
                        ? "text-gray-800"
                        : "text-white"
                    )}
                  >
                    Log in
                  </Button>
                </Link>
              </div>
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
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
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
            <nav className="flex space-x-1 items-center">
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
              {renderAuthUI()}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div 
          className={cn(
            "md:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
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
              {!user && (showAuthUI || !isLoading) && (
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
