'use client';

import { Button } from '@/components/ui/button';
import { handleApiError, showSuccessMessage } from '@/lib/error-handling';

export default function ErrorTestPage() {
  const testApiError = () => {
    handleApiError(new Error('This is a simulated API error'));
  };

  const testSuccessMessage = () => {
    showSuccessMessage('This is a test success message!');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Error Handling Tests</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Error Test</h2>
          <p className="text-sm text-gray-600 mb-3">
            Click below to simulate an API error with toast notification
          </p>
          <Button onClick={testApiError}>Trigger API Error</Button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Success Message Test</h2>
          <p className="text-sm text-gray-600 mb-3">
            Click below to show a success toast notification
          </p>
          <Button onClick={testSuccessMessage}>Show Success Message</Button>
        </div>
      </div>
    </div>
  );
}
