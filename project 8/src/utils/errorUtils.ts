export interface ErrorDetails {
  message: string;
  url?: string;
  status?: number;
  timestamp?: Date;
  browser?: string;
  action?: string;
  isRecurring?: boolean;
  systemChanges?: string;
}

export const createErrorDetails = (
  error: unknown,
  additionalInfo?: Partial<ErrorDetails>
): ErrorDetails => {
  let message: string;
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'toString' in error) {
    message = error.toString();
  } else {
    message = 'An unknown error occurred';
  }

  return {
    message,
    url: window.location.href,
    timestamp: new Date(),
    browser: navigator.userAgent,
    ...additionalInfo
  };
};

export const logError = (error: ErrorDetails): void => {
  const logData = {
    message: error.message,
    url: error.url,
    status: error.status,
    timestamp: error.timestamp?.toISOString(),
    browser: error.browser,
    action: error.action,
    isRecurring: error.isRecurring,
    systemChanges: error.systemChanges
  };

  console.error('API Error:', logData);
};