import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/hero", label: "Hero & Home" },
  { to: "/admin/buildings", label: "Buildings" },
  { to: "/admin/building-types", label: "Building Types" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/product-categories", label: "Product Categories" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/board", label: "Board" },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  const navContent = (
    <>
      <p className="mb-10 font-display text-lg font-semibold text-paper">Meridian Admin</p>
      <nav className="space-y-1 font-mono text-xs uppercase tracking-widest">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2 transition-colors ${
                isActive ? "bg-steel text-paper" : "text-concrete/70 hover:bg-steel/20 hover:text-paper"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-10 w-full border border-concrete/20 px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-concrete/70 hover:border-amber hover:text-amber"
      >
        Log out
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-concrete/30 lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-ink px-5 py-4 lg:hidden">
        <p className="font-display text-lg font-semibold text-paper">Meridian Admin</p>
        <button onClick={() => setMobileOpen((o) => !o)} className="font-mono text-xs uppercase tracking-widest text-paper">
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>
      {mobileOpen && (
        <div className="bg-ink px-5 pb-6 lg:hidden">
          <nav className="space-y-1 font-mono text-xs uppercase tracking-widest">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 transition-colors ${
                    isActive ? "bg-steel text-paper" : "text-concrete/70 hover:bg-steel/20 hover:text-paper"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-6 w-full border border-concrete/20 px-3 py-2 text-left font-mono text-xs uppercase tracking-widest text-concrete/70 hover:border-amber hover:text-amber"
          >
            Log out
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 bg-ink px-5 py-8 lg:block">
        {navContent}
      </aside>

      <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
