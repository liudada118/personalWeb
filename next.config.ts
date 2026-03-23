import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

import { normalizeBasePath } from "./lib/site-paths";

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  basePath,
  output: "standalone",
};

export default withPayload(nextConfig);
