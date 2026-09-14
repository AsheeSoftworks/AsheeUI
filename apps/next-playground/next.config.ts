import type { NextConfig } from "next";

/**
 * The playground's Next.js configuration.
 *
 * The gallery and the library are workspace packages published from TypeScript
 * sources in this repository, so a consumer that links them has to compile them:
 * that is what `transpilePackages` declares.
 */
const nextConfig: NextConfig = {
  transpilePackages: ["asheeui", "@asheeui/e2e-gallery"],
};

export default nextConfig;
