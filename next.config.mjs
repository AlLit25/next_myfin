/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    basePath: isProd ? '/next_myfin' : '',
    assetPrefix: isProd ? '/next_myfin/' : '/',
    images: {
        unoptimized: true,
    },
    distDir: 'docs',
};

export default nextConfig;