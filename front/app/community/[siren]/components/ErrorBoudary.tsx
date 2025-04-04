"use client"
import { useEffect, useState } from 'react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  const resetError = () => setHasError(false);

  const ErrorFallback = () => (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={resetError}>Try Again</button>
    </div>
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      setHasError(true);
      console.error('Caught an error:', error);
    };

    window.onerror = (msg, url, lineNo, columnNo, error) => {
      if (error instanceof Error) {
        handleError(error);
      }
      return true;
    };

    window.onunhandledrejection = (event) => {
      handleError(event.reason);
    };

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  if (hasError) {
    return <ErrorFallback />;
  }

  return children;
}
