export default function SectionTitle({
  number,
  eyebrow,
  title,
  text
}) {

  return (
    <div className="section-heading">

      <div className="section-number">
        {number}
      </div>

      <div>

        <p className="section-eyebrow">
          {eyebrow}
        </p>

        <h2>
          {title}
        </h2>

        {text && (
          <p className="section-lead">
            {text}
          </p>
        )}

      </div>

    </div>
  );
}