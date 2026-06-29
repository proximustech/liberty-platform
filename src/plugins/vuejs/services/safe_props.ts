/**
 * Safely serializes data for injection into an HTML <script> tag.
 * Escapes </script> sequences to prevent XSS via early script tag termination.
 */
export const safeProps = (data: unknown): string =>
  JSON.stringify(data).replace(/<\//g, '\\u003c/')
