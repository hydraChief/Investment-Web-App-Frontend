export const metadata = {
  title: 'Investment Portfolio',
  description: 'Track and manage your investments',
};

import Link from 'next/link';
import './globals.css';
import Sidebar from '@/components/sidebar/Sidebar';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className='header'>
          <h1><Link className="header-heading" href="/">Investment Portfolio</Link></h1>
        </header>
        <main className='main'>
          <>
            <Sidebar />
            <div style={{height:'100%', width:'100%',flexGrow:1}}>
              {children}
            </div>
          </>
        </main>
      </body>
    </html>
  );
}