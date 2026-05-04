import { withSentryConfig } from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "katedoug",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  autoInstrumentMiddleware: false,
});
