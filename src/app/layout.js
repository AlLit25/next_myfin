import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import getConfig from 'next/config';
import Head from "next/head";

export const metadata = {
    title: "LiVi Analytics",
    description: "Додаток для фінансів",
    icons: {
        icon: getConfig.name['assetPrefix']+'favicon.ico',
        apple: getConfig.name['assetPrefix']+'apple-icon.ico',
    },
};

export default function RootLayout({ children }) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(getConfig.name['assetPrefix']+'sw.js');
    }

    return (
        <html lang="en">
            <Head>
                <link rel="manifest" href={ getConfig.name['assetPrefix']+"/manifest.json"} />
                <meta name="theme-color" content="#000000" />
                <link rel="apple-touch-icon" href={getConfig.name['assetPrefix']+"/logo.png"} />
            </Head>
            <body className="container">
                {children}
            </body>
        </html>
    );
}
