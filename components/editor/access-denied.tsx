import Link from 'next/link';
import { Lock } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-base px-4">
      <Lock className="h-8 w-8 text-copy-muted" />
      <p className="text-center text-sm text-copy-secondary">You don&apos;t have access to this project.</p>
      <Link href="/editor" className={cn(buttonVariants(), 'inline-flex')}>
        Back to editor
      </Link>
    </div>
  );
}
