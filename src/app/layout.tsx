// 루트 레이아웃
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import JotaiProvider from './providers';
import Script from 'next/script';

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ever.Photobook',
  description: 'Ever.Photobook',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${notoSansKR.variable} antialiased`}>
        <JotaiProvider>{children}</JotaiProvider>

        {/* Cloudflare Analytics 스크립트 - CORS 문제 해결을 위해 Next.js Script 사용 */}
        <Script src="https://static.cloudflareinsights.com/beacon.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
