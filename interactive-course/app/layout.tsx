import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ziwei-master-course-tw-20260904.chemistrywilly310.chatgpt.site'),
  title: {
    default: '紫微斗數・大師課',
    template: '%s｜紫微斗數・大師課',
  },
  description: '從零開始，循序讀懂命盤結構、星曜、四化與十二宮位的繁體中文互動課程。',
  openGraph: {
    title: '紫微斗數・大師課',
    description: '以結構、來源與使用邊界為核心的繁體中文互動學習課程。',
    type: 'website',
    locale: 'zh_TW',
    url: '/',
    images: [{ url: '/ziwei-hero-original.png', alt: '紫微斗數大師課的夜讀學習插畫' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '紫微斗數・大師課',
    description: '用結構學習，用證據說話。',
    images: ['/ziwei-hero-original.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
