import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* LEFT SIDE: Brand Name (Typography as Logo) */}
        <div className="brand-section">
          <h2 className="brand-title">AUREVRA</h2>
          <p className="brand-sub">JEWELRY</p>
        </div>

        {/* RIGHT SIDE: Info Grid */}
        <div className="info-section">
            
          {/* Column 1: Contact & Address */}
          <div className="footer-column">
            <h3>CONTACT & ADDRESS</h3>
            <hr />
            <p>aurevrajewelry@gmail.com</p>
            <p>09123456789</p>
            <p className="mt-space">Bulacan State University,<br/>Hagonoy Bulacan</p>
          </div>

          {/* Column 2: About */}
          <div className="footer-column">
            <h3>ABOUT US</h3>
            <hr />
            <p>
              Aurevra Jewelry is a timeless collection celebrating individuality
              and craftsmanship.
            </p>
          </div>

          {/* Column 3: Developers */}
          <div className="footer-column">
            <h3>DEVELOPERS</h3>
            <hr />
            <p>Queenie Ruth Legaspi</p>
            <p>Josh Lenard Oliveros</p>
            <p>April Mae Agustin</p>
            <p>Vince Vuzty Nabong</p>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Aurevra Jewelry. All Rights Reserved.</p>
      </div>
    </footer>
  );
}