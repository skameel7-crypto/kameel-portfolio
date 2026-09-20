import { useState } from "react";

export default function LazyImage({
  src,
  alt,
  className = "",
  fallbackLetter = "K",
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`lazy-fallback ${className}`.trim()} aria-hidden="true">
        <span>{fallbackLetter}</span>
      </div>
    );
  }

  return (
    <div className={`lazy-wrap ${loaded ? "loaded" : ""} ${className}`.trim()}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...rest}
      />
    </div>
  );
}