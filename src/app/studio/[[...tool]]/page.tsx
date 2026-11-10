import type { Metadata } from 'next';
import StudioClient from './StudioClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'АЛФА Studio',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioClient />;
}
