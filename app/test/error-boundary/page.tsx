'use client';

import { Button } from '@/components/ui/button';

export default function ErrorTestPage() {
  const throwError = () => {
    throw new Error('This is a test error for ErrorBoundary');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Error Boundary Test</h1>
      <p className="mb-6">Click the button below to test the error boundary</p>
      <Button onClick={throwError}>
        Throw Test Error
      </Button>
    </div>
  );
}
