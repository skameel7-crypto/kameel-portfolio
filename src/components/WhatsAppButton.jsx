import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

const DEFAULT_MESSAGE =
  "Hi Kameel! I found your portfolio and I'd love to discuss a project with you.";

export default function WhatsAppButton({
  phone = "917617483900", // country code + number, no spaces or +
  message = DEFAULT_MESSAGE,
  tooltip = "Chat on WhatsApp",
}) {
  const [showTip, setShowTip] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gentle entrance after page load
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Auto-show the tooltip once after appearing, then hide
  useEffect(() => {
    if (!mounted) return;
    const show = setTimeout(() => setShowTip(true), 700);
    const hide = setTimeout(() => setShowTip(false), 5500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [mounted]);

  const href = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div
      className={`wa-float ${mounted ? "is-mounted" : ""}`}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {/* Tooltip bubble */}
      <div className={`wa-tip ${showTip ? "show" : ""}`} aria-hidden={!showTip}>
        <button
          type="button"
          className="wa-tip-close"
          onClick={(e) => {
            e.stopPropagation();
            setShowTip(false);
          }}
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>
        <strong>Chat on WhatsApp</strong>
        <span>Replies within a few hours</span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="wa-btn"
        aria-label="Chat on WhatsApp"
        title={tooltip}
      >
        <span className="wa-pulse" aria-hidden="true" />
        <FaWhatsapp size={26} className="wa-icon" />
      </a>
    </div>
  );
}