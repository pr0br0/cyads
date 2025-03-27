import { toast } from 'react-hot-toast';
import { captureException } from './sentry';

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function handleApiError(error: unknown, context = {}): void {
  const errorWithMessage = toErrorWithMessage(error);
  
  // Log to Sentry
  captureException(errorWithMessage, {
    ...context,
    type: 'API_ERROR'
  });

  // Show user-friendly message
  toast.error(errorWithMessage.message, {
    position: 'bottom-center',
    duration: 5000
  });
}

export function showSuccessMessage(message: string): void {
  toast.success(message, {
    position: 'bottom-center',
    duration: 3000
  });
}
