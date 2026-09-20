import DevCredit from "./DevCredit";

export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">K</span>
            <span>Kameel</span>
          </div>

          <p>UI/UX · Graphic Design · Branding · Video</p>
        </div>

        <a href="#home">Back to top ↑</a>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Kameel. All rights reserved.
        </span>

        <div className="footer-bottom-right">


          {/* ⬇️ Developer credit — right corner */}
          <DevCredit size={28} />
        </div>
      </div>
    </footer>
  );
}