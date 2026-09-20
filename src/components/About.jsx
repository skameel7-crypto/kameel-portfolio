import { useState } from "react";
import {
  Palette,
  Users,
  Layers3,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react";

import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

export default function About({ profile }) {
  const [imgError, setImgError] = useState(false);

  const name = profile?.name?.trim() || "Kameel";
  const email = profile?.email?.trim() || "";
  const phone = profile?.phone?.trim() || "";
  const location = profile?.location?.trim() || "India";
  const tagline =
    profile?.tagline?.trim() ||
    "Designing experiences with clarity, creativity and purpose.";
  const about =
    profile?.about?.trim() ||
    "I create clean, meaningful and user-focused digital experiences through UI/UX design, graphic design, branding and visual storytelling.";
  const photo = profile?.photo?.trim() || "";
  const roles =
    Array.isArray(profile?.roles) && profile.roles.length
      ? profile.roles
      : ["UI/UX Designer", "Graphic Designer"];

  const showPhoto = photo && !imgError;

  return (
    <section className="section cream" id="about">
      <div className="container">
        <SectionTitle
          number="01"
          eyebrow="Profile"
          title="A designer who enjoys turning ideas into experiences."
          text="A creative profile combining UI/UX, visual design, branding and digital storytelling."
        />

        <Reveal className="about-grid" variant="up">
          {/* ═══════════ PROFILE CARD (photo breakout) ═══════════ */}
          <aside className="profile-card profile-card--breakout">
            {/* Decorative rotating rings behind the photo */}
            <span className="profile-ring profile-ring-a" aria-hidden="true" />
            <span className="profile-ring profile-ring-b" aria-hidden="true" />

            {/* Photo breakout */}
            <div className="profile-photo-breakout">
              <div className="profile-photo-inner">
                {showPhoto ? (
                  <img
                    src={photo}
                    alt={`${name} — profile`}
                    loading="lazy"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span aria-hidden="true">
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="profile-badge">
                <Sparkles size={12} /> Designer
              </div>
            </div>

            {/* Card body (starts below the photo) */}
            <div className="profile-card-body">
              <p className="tiny-label">PROFILE</p>

              <h3>{name}</h3>

              <p className="muted">{roles.join(" · ")}</p>

              <div className="profile-meta">
                <span>
                  <Mail
                    size={11}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  EMAIL
                </span>
                <strong>
                  {email ? (
                    <a href={`mailto:${email}`}>{email}</a>
                  ) : (
                    <span className="muted">Not provided</span>
                  )}
                </strong>

                <span>
                  <Phone
                    size={11}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  PHONE
                </span>
                <strong>
                  {phone ? (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                  ) : (
                    <span className="muted">Not provided</span>
                  )}
                </strong>

                <span>
                  <MapPin
                    size={11}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  LOCATION
                </span>
                <strong>{location}</strong>
              </div>
            </div>
          </aside>

          {/* ═══════════ ABOUT COPY ═══════════ */}
          <div className="about-copy">
            <h3>{tagline}</h3>

            <p>{about}</p>

            <p>
              My approach starts with understanding the user, simplifying the
              problem and creating visual solutions that are easy to understand
              and enjoyable to use.
            </p>

            <div className="highlight-grid">
              <Reveal className="highlight" variant="up" delay={120}>
                <Palette aria-hidden="true" />
                <strong>Visual Thinking</strong>
                <span>Clean, balanced and purposeful visual design.</span>
              </Reveal>

              <Reveal className="highlight" variant="up" delay={220}>
                <Users aria-hidden="true" />
                <strong>User Focus</strong>
                <span>Interfaces designed around real user needs.</span>
              </Reveal>

              <Reveal className="highlight" variant="up" delay={320}>
                <Layers3 aria-hidden="true" />
                <strong>Design Systems</strong>
                <span>Consistent components and reusable patterns.</span>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}