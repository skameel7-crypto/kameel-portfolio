import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  to = 0,
  duration = 1600,
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const startedRef = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion users — jump straight to target
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        obs.unobserve(el);

        const target = Number(to) || 0;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic — fast start, slow finish (feels premium)
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <strong ref={ref} className={`skill-counter ${className}`.trim()}>
      {value}
      {suffix}
    </strong>
  );
}