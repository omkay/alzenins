import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Cloud Run runs a container, not a platform build. Standalone emits a
  // self-contained server with only the dependencies it actually uses.
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    // Legacy URLs from the brochure site. The full 301 map is a Phase 9
    // deliverable; these cover the four routes that exist today.
    return [
      { source: "/courses", destination: "/ar/courses", permanent: true },
      { source: "/products", destination: "/ar/store", permanent: true },
      { source: "/about", destination: "/ar/about", permanent: true },
      { source: "/contact", destination: "/ar/contact", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
