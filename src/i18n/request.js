import { getRequestConfig } from 'next-intl/server';
import { locales } from '../../i18n.js';

export default getRequestConfig(async ({ locale }) => {
  try {
    return {
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // Fallback to English
    return {
      messages: (await import('../../messages/en.json')).default
    };
  }
}); 