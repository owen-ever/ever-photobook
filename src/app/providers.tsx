'use client';

import { ReactNode } from 'react';
import { Provider } from 'jotai';

// custom jotai provider
export default function Providers({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
