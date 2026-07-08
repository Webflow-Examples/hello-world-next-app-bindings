import type { NextConfig } from 'next';
import { execSync } from 'node:child_process';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

// User's custom Next.js configuration
// NOTE: basePath is handled by Webflow Cloud builder
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Expose the mount path to client code as an env var so client-side
  // fetch() calls can prefix it (Next.js's basePath only auto-prefixes
  // <Link>/<Image>/router, not fetch).
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.COSMIC_MOUNT_PATH || '',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },
};

// Webflow Cloud end-to-end test hook. During the production build (what
// `opennextjs-cloudflare build` runs when deploying to Webflow Cloud), emit the
// build-time secret probe so its output flows through the build log pipeline
// and the tests can verify build-time secret values are redacted from build
// logs. Guarded on E2E_TEST_SECRET, so it is a complete no-op for `next dev`
// and for normal builds that never set that variable.
export default (phase: string): NextConfig => {
  if (phase === PHASE_PRODUCTION_BUILD && process.env.E2E_TEST_SECRET) {
    try {
      execSync('npm run e2e:buildtime-secret-probe', { stdio: 'inherit' });
    } catch (error) {
      console.error('[webflow-cloud-e2e] build-time secret probe failed', error);
    }
  }

  return nextConfig;
};
