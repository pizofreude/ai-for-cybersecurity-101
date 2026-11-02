import { connection } from 'next/server';
import Nav from '@/components/Nav';
import './globals.css';

export const metadata = {
  title: 'LabShop (deliberately vulnerable)',
  description: 'Training app for AI for Cybersecurity 101. Localhost only.',
};

export default async function RootLayout({ children }) {
  // Render every page per request, so each response carries a fresh CSP nonce.
  await connection();
  return (
    <html lang="en">
      <body>
        <div className="banner" role="alert">
          DELIBERATELY VULNERABLE TRAINING APP. Runs on 127.0.0.1 only. Never deploy it.
          Attack only this lab or an app you own (Computer Crimes Act 1997 s.3).
        </div>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
