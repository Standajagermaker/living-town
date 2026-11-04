import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Living Town · První den', description: 'Hratelný pilot živého městečka' };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="cs"><body>{children}</body></html> }
