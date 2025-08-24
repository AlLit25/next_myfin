/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Статический экспорт
    basePath: '/next_myfin', // Укажите имя репозитория
    assetPrefix: '/next_myfin/', // Для корректной загрузки ресурсов
    images: {
        unoptimized: true, // Отключает оптимизацию изображений
    },
};

export default nextConfig;
