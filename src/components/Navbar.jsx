import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/buildings", label: "Buildings" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/what-we-do", label: "What We Do" },
  { to: "/blog", label: "Journal" },
  { to: "/board", label: "Board" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brand, setBrand] = useState({
    logo_url: null,
    site_name: "Meridian Builders",
  });
  const location = useLocation();
  const isHome = location.pathname === "/";
  // Only the home page has a full-bleed dark hero behind the navbar,
  // so only there can the navbar start transparent and still be legible.
  const solid = scrolled || !isHome;

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("logo_url, site_name")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setBrand(data);
      });
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        solid
          ? "bg-ink/95 shadow-lg shadow-ink/10 backdrop-blur-sm"
          : "bg-gradient-to-b from-ink/85 to-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <Link to="/" className="flex items-center gap-2">
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.site_name}
              className="h-8 w-auto"
            />
          ) : (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-lg font-semibold tracking-tight text-paper"
            >
              {brand.site_name}
            </motion.span>
          )}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 font-mono text-xs uppercase tracking-widest lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="group relative py-1">
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? "text-amber"
                        : "text-paper/80 transition-colors group-hover:text-paper"
                    }
                  >
                    {link.label}
                  </span>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-amber transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-paper transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-paper transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-paper transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-ink lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-8 pt-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `border-b border-paper/10 py-3 font-mono text-xs uppercase tracking-widest ${
                      isActive ? "text-amber" : "text-paper/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
