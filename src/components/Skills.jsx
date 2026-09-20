import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";

export default function Skills({ skills = [] }) {
  return (
    <section className="section alt" id="skills">
      <div className="container">
        <SectionTitle
          number="02"
          eyebrow="Skills"
          title="Tools and skills I use to design."
        />

        <div className="skills-grid">
          {skills.map((skill, i) => {
            const level = Math.max(0, Math.min(100, Number(skill.level) || 0));

            return (
              <Reveal
                as="article"
                className="skill-card"
                key={skill.id || skill.name || `skill-${i}`}
                delay={i * 90}
                variant="up"
              >
                <div className="skill-top">
                  <div>
                    <h3>{skill.name}</h3>
                    <span>{skill.category}</span>
                  </div>

                  <AnimatedCounter
                    to={level}
                    suffix="%"
                    duration={1500 + i * 60}
                  />
                </div>

                {/* Bar uses CSS var; animates when .is-visible is on parent */}
                <div className="progress">
                  <span
                    style={{
                      "--target-width": `${level}%`,
                      transitionDelay: `${250 + i * 90}ms`,
                    }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}