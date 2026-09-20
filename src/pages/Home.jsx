import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

import { getCollection, getProfile } from "../services/data";
import {
  defaultEducation,
  defaultProfile,
  defaultProjects,
  defaultSkills,
} from "../data/defaultData";

export default function Home() {
  const [profile, setProfile] = useState(defaultProfile);
  const [skills, setSkills] = useState(defaultSkills);
  const [education, setEducation] = useState(defaultEducation);
  const [projects, setProjects] = useState(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [p, s, e, pr] = await Promise.all([
          getProfile().catch(() => null),
          getCollection("skills").catch(() => []),
          getCollection("education").catch(() => []),
          getCollection("projects").catch(() => []),
        ]);

        if (cancelled) return;

        if (p) setProfile({ ...defaultProfile, ...p });
        if (s.length) setSkills(s);
        if (e.length) setEducation(e);
        if (pr.length) setProjects(pr);
      } catch (err) {
        console.warn("[home] falling back to default data:", err?.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Build a clean international WhatsApp number from profile.phone.
     Strips everything except digits (+, spaces, dashes).
     "+91 91761 74839" → "919176174839" */
  const waPhone = String(profile?.phone || "+91 91761 74839").replace(
    /\D/g,
    ""
  );

  const waMessage = `Hi ${
    profile?.name || "Kameel"
  }! I found your portfolio and I'd like to discuss a project.`;

  return (
    <>
      <Navbar />

      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Education education={education} />
        <Projects projects={projects} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />

      {/* Floating WhatsApp — pinned to the bottom-right corner */}
      {!loading && (
        <WhatsAppButton phone={waPhone} message={waMessage} />
      )}
    </>
  );
}