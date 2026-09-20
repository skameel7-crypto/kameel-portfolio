import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaLinkedin, FaInstagram, FaBehance } from "react-icons/fa";

import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";
import { sendContactEmail } from "../services/email";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact({ profile }) {
  const [formData, setFormData] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      await sendContactEmail(formData);
      setStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData(EMPTY);
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Could not send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const email = profile?.email?.trim() || "";
  const phone = profile?.phone?.trim() || "";
  const location = profile?.location?.trim() || "India";
  const linkedin = profile?.linkedin?.trim() || "";
  const behance = profile?.behance?.trim() || "https://www.behance.net/mr_kameel";

  return (
    <section className="section alt" id="contact">
      <div className="container">
        <SectionTitle
          number="05"
          eyebrow="Contact"
          title="Let's work together."
          text="Have a project, job opportunity, or just want to say hello? Feel free to reach out."
        />

        <div className="contact-grid">
          {/* ═══════════ LEFT — INFO ═══════════ */}
          <Reveal variant="left">
            <p className="contact-intro">
              I&apos;m always open to discussing new projects, creative ideas
              and opportunities to be part of your team.
            </p>

            <div className="contact-list">
              <a
                href={email ? `mailto:${email}` : undefined}
                className="contact-card"
              >
                <span className="contact-card-icon">
                  <Mail size={20} />
                </span>
                <span className="contact-card-text">
                  <small>Email</small>
                  <strong>{email || "Not provided"}</strong>
                </span>
              </a>

              <a
                href={phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined}
                className="contact-card"
              >
                <span className="contact-card-icon">
                  <Phone size={20} />
                </span>
                <span className="contact-card-text">
                  <small>Phone</small>
                  <strong>{phone || "Not provided"}</strong>
                </span>
              </a>

              <div className="contact-card contact-card--static">
                <span className="contact-card-icon">
                  <MapPin size={20} />
                </span>
                <span className="contact-card-text">
                  <small>Location</small>
                  <strong>{location}</strong>
                </span>
              </div>
            </div>

            {/* ═══════════ SOCIAL LINKS ═══════════ */}
            <div className="social-block">
              <p className="social-label">Follow me</p>

              <div className="social-links">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="social-link social-link--linkedin"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}

                {behance && (
                  <a
                    href={behance}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Behance"
                    className="social-link social-link--behance"
                  >
                    <FaBehance size={20} />
                  </a>
                )}

                <a
                  href="https://www.instagram.com/_kameel_04/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="social-link social-link--instagram"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* ═══════════ RIGHT — FORM ═══════════ */}
          <Reveal variant="right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Your Name
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Your Email
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending}
                style={{ justifySelf: "start" }}
              >
                <Send size={18} />
                {sending ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p
                  className="form-status"
                  style={{
                    color:
                      status.type === "error" ? "#9a2b1e" : "var(--green)",
                  }}
                >
                  {status.message}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}