/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    basePath: isProd ? '/next_myfin' : '', // /next_myfin для продакшена, пустой для разработки
    assetPrefix: isProd ? '/next_myfin/' : '/', // Аналогично для ресурсов
    images: {
        unoptimized: true,
    },
    distDir: 'docs',
};

export default nextConfig;