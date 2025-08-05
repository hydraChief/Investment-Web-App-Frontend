export const metadata = {
  title: 'Investment Portfolio',
  description: 'Track and manage your investments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: '#2a3f54', padding: '1rem', color: 'white', textAlign: 'center' }}>
          <h1>Investment Portfolio</h1>
        </header>
        <main style={{ padding: '1rem' }}>{children}</main>
      </body>
    </html>
  );
}