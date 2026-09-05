import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="hero-subtitle">GAMING & PC SETUP MARKETPLACE</p>

        <h1>
          Build your ultimate
          <br />
          battlestation.
        </h1>

        <p className="hero-description">
          Performance gear for serious players, creators, and anyone who wants
          a better desk. Choose your parts, match your style, and make it yours.
        </p>

        <div className="hero-actions">
          <Link to="/products" className="shop-button">
            Shop gaming gear
          </Link>
          <a href="#setup-builder" className="hero-link">
            Build your setup <span>→</span>
          </a>
        </div>

        <div className="hero-proof">
          <span>✓ Tested for performance</span>
          <span>✓ Fast local delivery</span>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=85"
          alt="Gaming and PC setup with monitor and keyboard"
        />
        <div className="hero-floating-card">
          <span>Setup of the week</span>
          <strong>Clean desk. Serious performance.</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;