import Link from 'next/link';
import './landingPage.css';
export default function HomePage() {
  return (
    <div className='main-container'>
      <p>Track, buy, and sell your investments easily.</p>
      <Link href="/investments" className="btn">
        <div className='btn-content'>
          Stocks
        </div>
      </Link>
      <Link href="/dashboard" className="btn secondary">
        <div className='btn-content'>
          Dashboard
        </div>
      </Link>
    </div>
  );
}