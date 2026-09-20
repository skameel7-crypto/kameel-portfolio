import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Images,
  Palette,
  X,
} from "lucide-react";

import SectionTitle from "./SectionTitle";
import LazyImage from "./LazyImage";
import Reveal from "./Reveal";

/* ═══════════════════════════════════════════════════════════
   Category normalizer — matches any free-text category
   to one of the 4 canonical buckets.
   ═══════════════════════════════════════════════════════════ */
const FILTERS = [
  { key: "all", label: "All" },
  { key: "uiux", label: "UI/UX" },
  { key: "logo", label: "Logo" },
  { key: "graphic", label: "Graphic" },
  { key: "video", label: "Video Editing" },
];

function normalizeCategory(cat) {
  const c = String(cat || "").toLowerCase().trim();
  if (!c) return "graphic";
  if (c.includes("logo")) return "logo";
  if (c.includes("ui") || c.includes("ux")) return "uiux";
  if (c.includes("video") || c.includes("edit") || c.includes("motion"))
    return "video";
  if (
    c.includes("graphic") ||
    c.includes("visual") ||
    c.includes("brand") ||
    c.includes("poster") ||
    c.includes("flyer")
  )
    return "graphic";
  return "graphic";
}

/* ═══════════════════════════════════════════════════════════
   ProjectGallery — snap-scroll carousel
   ═══════════════════════════════════════════════════════════ */
function ProjectGallery({ images = [], title = "" }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(images.length - 1, i));
    track.scrollTo({
      left: clamped * track.clientWidth,
      behavior: "smooth",
    });
    setIndex(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) setIndex(i);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  if (!images.length) return null;

  return (
    <div className="pg">
      <div className="pg-track" ref={trackRef} onScroll={onScroll}>
        {images.map((src, i) => (
          <div
            className={`pg-slide ${i === index ? "active" : ""}`}
            key={`${title}-${i}`}
          >
            <img
              src={src}
              alt={`${title} — design ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="pg-nav pg-prev"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="pg-nav pg-next"
            onClick={() => goTo(index + 1)}
            disabled={index === images.length - 1}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="pg-counter">
            {index + 1} / {images.length}
          </div>

          <div className="pg-dots">
            {images.map((_, i) => (
              <button
                type="button"
                key={`dot-${i}`}
                className={i === index ? "active" : ""}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Projects section
   ═══════════════════════════════════════════════════════════ */
export default function Projects({ projects = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Attach normalized category to each project
  const decorated = useMemo(
    () =>
      projects.map((p) => ({
        ...p,
        _cat: normalizeCategory(p.category),
      })),
    [projects]
  );

  // Counts per filter (to show next to labels, and hide empty tabs)
  const counts = useMemo(() => {
    const c = { all: decorated.length };
    FILTERS.forEach((f) => {
      if (f.key === "all") return;
      c[f.key] = decorated.filter((p) => p._cat === f.key).length;
    });
    return c;
  }, [decorated]);

  // Only show filters that actually have projects (plus "All")
  const visibleFilters = FILTERS.filter(
    (f) => f.key === "all" || counts[f.key] > 0
  );

  const filtered = useMemo(() => {
    if (activeFilter === "all") return decorated;
    return decorated.filter((p) => p._cat === activeFilter);
  }, [decorated, activeFilter]);

  // Lock body scroll while modal open
  useEffect(() => {
    if (!selectedProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedProject]);

  // Close on Escape
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject]);

  return (
    <section className="section cream" id="projects">
      <div className="container">
        <SectionTitle
          number="04"
          eyebrow="My Work"
          title="Projects"
          text="A collection of my UI/UX, graphic design and creative projects."
        />

        {projects.length === 0 ? (
          <div className="empty-state">
            <Palette size={40} />
            <h3>No projects added yet</h3>
            <p>Add your projects from the admin dashboard.</p>
          </div>
        ) : (
          <>
            {/* ═══════ FILTER TABS ═══════ */}
            <div
              className="project-filters"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {visibleFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === f.key}
                  className={`filter-tab ${
                    activeFilter === f.key ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  <span>{f.label}</span>
                  <span className="filter-count">{counts[f.key] || 0}</span>
                </button>
              ))}
            </div>

            {/* ═══════ PROJECT GRID ═══════ */}
            {filtered.length === 0 ? (
              <div className="empty-state empty-state--filter">
                <Palette size={36} />
                <h3>No projects in this category yet</h3>
                <p>Try another filter or check back later.</p>
              </div>
            ) : (
              <div className="projects-grid" key={activeFilter}>
                {filtered.map((project, index) => {
                  const cover =
                    project.image || project.images?.[0] || "";
                  const totalImages =
                    project.images?.length || (project.image ? 1 : 0);

                  return (
                    <Reveal
                      key={
                        project.id ||
                        project.title ||
                        `project-${index}`
                      }
                      as="article"
                      className="project-card"
                      delay={index * 60}
                    >
                      <div className="project-image">
                        {cover ? (
                          <LazyImage
                            src={cover}
                            alt={project.title || "Project"}
                            className="project-cover"
                            fallbackLetter={(project.title || "P").charAt(
                              0
                            )}
                          />
                        ) : (
                          <div className="project-placeholder">
                            <span>
                              {(project.title || "K").charAt(0)}
                            </span>
                            <small>
                              {project.category || "PROJECT"}
                            </small>
                          </div>
                        )}

                        {project.category && (
                          <span className="project-number">
                            {project.category}
                          </span>
                        )}

                        {totalImages > 1 && (
                          <span className="project-photo-count">
                            <Images size={13} /> {totalImages}
                          </span>
                        )}
                      </div>

                      <div className="project-body">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>

                        {project.tools?.length > 0 && (
                          <div className="tags">
                            {project.tools.map((tool, i) => (
                              <span key={`${tool}-${i}`}>{tool}</span>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          className="text-link"
                          onClick={() => setSelectedProject(project)}
                        >
                          View Design <ExternalLink size={15} />
                        </button>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════ MODAL ═══════════ */}
      {selectedProject && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal project-modal--gallery"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {(() => {
              const gallery = selectedProject.images?.length
                ? selectedProject.images
                : selectedProject.image
                ? [selectedProject.image]
                : [];

              return gallery.length ? (
                <ProjectGallery
                  images={gallery}
                  title={selectedProject.title || "Project"}
                />
              ) : null;
            })()}

            <div className="modal-content">
              {selectedProject.category && (
                <span className="category">
                  {selectedProject.category}
                </span>
              )}

              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>

              {selectedProject.tools?.length > 0 && (
                <div className="tags">
                  {selectedProject.tools.map((t, i) => (
                    <span key={`${t}-${i}`}>{t}</span>
                  ))}
                </div>
              )}

              <div className="modal-actions">
                {selectedProject.figmaUrl && (
                  <a
                    href={selectedProject.figmaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                  >
                    <Palette size={18} /> Figma Design
                  </a>
                )}

                {selectedProject.pdfUrl && (
                  <a
                    href={selectedProject.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{
                      color: "var(--ink)",
                      borderColor: "var(--line)",
                    }}
                  >
                    <FileText size={18} /> Case Study
                  </a>
                )}

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-dark"
                  >
                    <ExternalLink size={18} /> Live Project
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}