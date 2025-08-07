import './globals.css';

export const metadata = {
  title: 'Finance Portfolio - Modern Investment Management',
  description: 'Track and manage your investments with our modern portfolio dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar" id="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <div className="brand-icon">💰</div>
              <h1>Finance Portfolio</h1>
            </div>
            <div className="nav-links">
              <a href="/dashboard" className="nav-link">Dashboard</a>
              <a href="/investments" className="nav-link">Investments</a>
              <a href="/bonds" className="nav-link">Bonds</a>
              <a href="/metals" className="nav-link">Metals</a>
            </div>
          </div>
        </nav>
        <main className="main-content">{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced navigation blur effect on scroll
              window.addEventListener('scroll', function() {
                const navbar = document.getElementById('navbar');
                if (window.scrollY > 50) {
                  navbar.classList.add('scrolled');
                } else {
                  navbar.classList.remove('scrolled');
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}