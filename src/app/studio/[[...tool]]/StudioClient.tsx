'use client';

import { Studio } from 'sanity';
import config from '../../../../sanity.config';

// next-sanity's NextStudio wrapper is not used: the Sanity v3 line it supports stops at Next 15.
export default function StudioClient() {
  return <Studio config={config} />;
}
