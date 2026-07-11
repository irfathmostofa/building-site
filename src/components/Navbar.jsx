import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const links = [
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
  const [brand, setBrand] = useState({ logo_url: null, site_name: "Meridian Builders" });

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

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-ink/85 to-transparent backdrop-blur-sm">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.site_name} className="h-8 w-auto" />
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-paper">
              {brand.site_name}
            </span>
          )}
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 font-mono text-xs uppercase tracking-widest lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-amber" : "text-paper/80 hover:text-paper"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span className={`h-0.5 w-6 bg-paper transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-paper transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-paper transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 bg-ink px-6 pb-8 pt-2 lg:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
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
      )}
    </header>
  );
}
