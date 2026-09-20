import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Skills", to: "/#skills" },
  { label: "Education", to: "/#education" },
  { label: "Projects", to: "/#projects" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Smooth-scroll to hash section after route changes
  useEffect(() => {
    setOpen(false);

    if (location.hash) {
      const id = location.hash.slice(1);
      // small delay so the page is rendered before scrolling
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return () => clearTimeout(t);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.hash]);

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">K</span>
        <span>Kameel</span>
      </Link>

      <div className={`nav-links ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
        <Link to="/admin/login" className="nav-admin">
          Admin
        </Link>
      </div>

      <button
        type="button"
        className="menu-btn"
        aria-label="Toggle navigation"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
}