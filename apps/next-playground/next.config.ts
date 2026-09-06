// next.config.ts

import { withAsheeUI } from "@asheeui/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  /* your existing config */
};

export default withAsheeUI(nextConfig);
