import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-surface-border">
        <div className="mb-10">
          <span className="text-lg font-semibold tracking-tight text-copy-primary">Ghost AI</span>
        </div>

        <h1 className="text-2xl font-medium text-copy-primary mb-3 leading-snug">System design, powered by AI</h1>
        <p className="text-copy-secondary text-sm mb-8 max-w-xs">
          Describe your architecture in plain English and collaborate in real time.
        </p>

        <ul className="space-y-2.5 text-copy-secondary text-sm">
          <li>Collaborative real-time architecture canvas</li>
          <li>AI-generated system designs from plain English</li>
          <li>Prebuilt starter templates for common patterns</li>
          <li>Automated Markdown technical spec generation</li>
        </ul>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <SignIn />
      </div>
    </div>
  );
}
