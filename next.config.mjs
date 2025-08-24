/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Статический экспорт
    basePath: '/next_myfin', // Подкаталог для GitHub Pages
    assetPrefix: '/next_myfin/', // Префикс для ресурсов
    images: {
        unoptimized: true, // Отключает оптимизацию изображений
    },
    distDir: 'docs', // Указывает, что выходная папка — docs вместо out
};

export default nextConfig;