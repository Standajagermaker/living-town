import './globals.css';
import './upgrade.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'Little Elsewhere · Living Town v0.5.0',description:'Živé městečko / Lebendige Kleinstadt – social world simulation'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="cs"><body>{children}</body></html>}
