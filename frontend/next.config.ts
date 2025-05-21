import { withNx } from '@nx/next/plugins/with-nx.js';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  nx: {
    svgr: false,
  },
  transpilePackages: ['@monorepo/shared'],
};

export default withNx(nextConfig);
