// Simple error logging utility for consistent error handling
// In a production app, this would send errors to a monitoring service

interface ErrorLogOptions {
  context?: string;
  user?: string;
  data?: any;
  sendToAnalytics?: boolean;
}

export const logError = (
  error: Error | string | unknown,
  options: ErrorLogOptions = {}
) => {
  const { context = 'app', user, data, sendToAnalytics = false } = options;
  
  // Format the error message
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Create a structured error log
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    user,
    message: errorMessage,
    stack: errorStack,
    data
  };
  
  // Log to console
  console.error(`[${context}] Error:`, errorLog);
  
  // In a real app, you would send this to your error tracking service
  // Example: Sentry.captureException(error, { extra: { context, user, data } });
  
  // Analytics tracking for errors (if enabled)
  if (sendToAnalytics) {
    try {
      // Example: 
      // analytics.track('Error Occurred', {
      //   context,
      //   errorType: error.name,
      //   message: errorMessage
      // });
      console.info('[Analytics] Error tracked:', errorMessage);
    } catch (analyticError) {
      console.error('Failed to send error to analytics:', analyticError);
    }
  }
  
  return errorLog;
};

// Helper for user-facing errors
export const handleUserError = (
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again.'
): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }
  return fallbackMessage;
};

// Check if the error is due to network connectivity issues
export const isNetworkError = (error: unknown): boolean => {
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
    
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('internet') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('failed to fetch')
  );
}; 