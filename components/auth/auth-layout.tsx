import { type ReactNode } from 'react';
import { Cpu, MousePointer2, FileText } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'AI Architecture Generation',
    description: 'Describe your system, AI maps it to nodes and edges on a live canvas.',
  },
  {
    icon: MousePointer2,
    title: 'Real-time Collaboration',
    description: 'Live cursors, presence indicators, and shared node editing across your team.',
  },
  {
    icon: FileText,
    title: 'Instant Spec Generation',
    description: 'Export a complete Markdown technical spec directly from the canvas graph.',
  },
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col bg-surface px-16 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-6 shrink-0 rounded bg-brand" />
          <span className="text-sm font-semibold text-copy-primary">Ghost AI</span>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center py-16">
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-copy-primary">
            Design systems at the
            <br />
            speed of thought.
          </h1>
          <p className="mb-10 max-w-sm text-sm leading-relaxed text-copy-secondary">
            Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine
            in real time.
          </p>

          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-elevated">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-copy-faint">© 2026 Ghost AI. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-base p-8">{children}</div>
    </div>
  );
}
