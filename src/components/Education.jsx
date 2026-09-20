import { GraduationCap } from "lucide-react";

import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

export default function Education({ education = [] }) {
  return (
    <section className="section cream" id="education">
      <div className="container">
        <SectionTitle
          number="03"
          eyebrow="Education"
          title="Learning that supports my creative work."
        />

        <div className="timeline">
          {education.map((item, i) => (
            <Reveal
              as="article"
              className="timeline-item"
              key={item.id || item.degree || `edu-${i}`}
              delay={i * 60}
            >
              <div className="timeline-dot">
                <GraduationCap size={18} />
              </div>

              <div className="timeline-card">
                <span className="date">{item.period}</span>
                <h3>{item.degree}</h3>
                <p className="institution">{item.institution}</p>
                <p>{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}