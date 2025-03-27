import * as Sentry from '@sentry/nextjs';

export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context
  });
  
  if (process.env.NODE_ENV !== 'production') {
    console.error(error, context);
  }
};

export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${level}] ${message}`);
  }
};

export const setUser = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: `${user.first_name} ${user.last_name}`,
  });
};

export const configureScope = (callback) => {
  Sentry.withScope(callback);
};
