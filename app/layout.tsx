import type { Metadata } from 'next';
import { Archivo, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap' });
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  verification: { google: 'kejhEBczT_dYCPgZeMa-mbji_ipbjcAWYmMLXO8ZBUA' },
  title: 'Ahnaf Shahriar — Close to the metal',
  description: 'Cofounder & CTO at Simantic (YC F26). Embedded systems, computer architecture, and tools that let AI understand the physical world.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${manrope.variable} ${archivo.variable}`}>{children}</body></html>;
}
