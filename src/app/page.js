'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Modern Portfolio Management
            <span className="gradient-text"> Made Simple</span>
          </h1>
          <p className="hero-subtitle">
            Track your investments across stocks, bonds, and precious metals with our intuitive dashboard. 
            Make informed decisions with real-time data and comprehensive analytics.
          </p>
          <div className="hero-buttons">
            <Link href="/dashboard" className="btn btn-primary">
              📊 View Dashboard
            </Link>
            <Link href="/investments" className="btn btn-secondary">
              💰 Start Investing
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-icon">📈</div>
            <div className="card-title">Portfolio Growth</div>
            <div className="card-value">+12.5%</div>
          </div>
          <div className="floating-card">
            <div className="card-icon">💰</div>
            <div className="card-title">Total Value</div>
            <div className="card-value">$125,430</div>
          </div>
          <div className="floating-card">
            <div className="card-icon">🏛️</div>
            <div className="card-title">Diversified</div>
            <div className="card-value">15 Assets</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>Built for modern investors who demand excellence</p>
        </div>
        
        <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Analytics</h3>
            <p>Get instant insights into your portfolio performance with live data and interactive charts.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Your investments are protected with enterprise-grade security and reliable infrastructure.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Optimized</h3>
            <p>Access your portfolio anywhere with our responsive design that works on all devices.</p>
          </div>
        </div>
      </section>

      {/* Asset Classes Section */}
      <section className="assets-section">
        <div className="section-header">
          <h2>Diversify Your Portfolio</h2>
          <p>Invest across multiple asset classes for better risk management</p>
        </div>
        
        <div className="grid grid-cols-3" style={{ marginTop: '3rem' }}>
          <div className="asset-card">
            <div className="asset-icon">📈</div>
            <h3>Stocks</h3>
            <p>Invest in individual company stocks with real-time market data and analysis tools.</p>
            <Link href="/investments" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Trade Stocks
            </Link>
          </div>
          
          <div className="asset-card">
            <div className="asset-icon">🏛️</div>
            <h3>Bonds</h3>
            <p>Add stability to your portfolio with government and corporate bonds.</p>
            <Link href="/bonds" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              View Bonds
            </Link>
          </div>
          
          <div className="asset-card">
            <div className="asset-icon">🥇</div>
            <h3>Precious Metals</h3>
            <p>Hedge against inflation with gold, silver, and other precious metals.</p>
            <Link href="/metals" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Trade Metals
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Investment Journey?</h2>
          <p>Join thousands of investors who trust our platform for their financial success.</p>
          <div className="cta-buttons">
            <Link href="/dashboard" className="btn btn-primary">
              Get Started Today
            </Link>
            <Link href="/investments" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}