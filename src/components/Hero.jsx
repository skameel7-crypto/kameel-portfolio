import { useEffect, useState } from "react";
import {
  ArrowRight,
  Download,
  Palette,
  Play,
  Sparkles,
  Mail,
} from "lucide-react";

const DEFAULT_ROLES = [
  "UI/UX Designer",
  "Graphic Designer",
  "Logo Designer",
  "Video Editor",
];

export default function Hero({ profile }) {
  const roles =
    profile?.roles && profile.roles.length ? profile.roles : DEFAULT_ROLES;

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex] ?? "";
    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && displayText === currentRole) delay = 1400;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText === currentRole) setIsDeleting(true);
        else setDisplayText(currentRole.slice(0, displayText.length + 1));
      } else {
        if (displayText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        } else {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const resumeHref = profile?.resumeUrl || "";
  const resumeName = `${(profile?.name || "Kameel").replace(
    /\s+/g,
    "_"
  )}_Resume.pdf`;

  return (
    <section className="hero" id="home">
      <div className="hero-grid" />
      <div className="hero-glow glow-one" />
      <div className="hero-glow glow-two" />

      <div className="hero-content">
        {/* LEFT */}
        <div className="hero-left">
          <div className="availability">
            <span /> Available for work
          </div>

          <p className="eyebrow">Hello, I&apos;m</p>
          <h1>{profile?.name || "Kameel"}</h1>

          <div className="typing">
            <span>{displayText}</span>
            <span className="cursor">|</span>
          </div>

          <p className="hero-description">
            I create clean, modern and user-friendly digital experiences
            through UI/UX design, graphic design, logo design and video
            editing.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => scrollTo("projects")}
            >
              View My Work <ArrowRight size={18} />
            </button>

            {/* ✅ Gold contact button */}
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => scrollTo("contact")}
            >
              <Mail size={17} /> Contact Me
            </button>

            {/* ✅ Resume download — shown only when uploaded */}
            {resumeHref && (
              <a
                href={resumeHref}
                download={resumeName}
                className="btn btn-ghost hero-resume-btn"
                title="Download Resume"
              >
                <Download size={18} /> Resume
              </a>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="design-orbit">
          <div className="orbit-ring ring-a" />
          <div className="orbit-ring ring-b" />

          <div className="ui-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
              <small>design.kameel</small>
            </div>

            <div className="ui-canvas">
              <div className="ui-title">
                UI <em>UX</em>
                <br />
                Design
              </div>

              <div className="ui-card-row">
                <div className="mini-card" />
                <div className="mini-card wide" />
              </div>

              <div className="ui-button">Get Started</div>
            </div>
          </div>

          <div className="floating-chip chip-top">
            <Sparkles size={14} /> Creative
          </div>
          <div className="floating-chip chip-side">
            <Palette size={14} /> Figma
          </div>
          <div className="floating-chip chip-bottom">
            <Play size={14} /> Video
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <Download size={14} /> Scroll to explore
      </div>
    </section>
  );
}