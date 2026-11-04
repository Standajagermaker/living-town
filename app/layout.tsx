import './globals.css';
import './upgrade.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Living Town · Pilot 002',description:'Zweisprachiges soziales Stadtspiel / Dvoujazyčné živé městečko'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="cs"><body>{children}</body></html>}
