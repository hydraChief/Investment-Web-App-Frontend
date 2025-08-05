import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>Track, buy, and sell your investments easily.</p>
      <Link href="/investments" className="btn">Go to Investments</Link>
      <br />
      <Link href="/dashboard" className="btn secondary">View Dashboard</Link>
    </div>
  );
}