import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

export const metadata = {
    title: "LiVi Analytics",
    description: "Додаток для фінансів",
    icons: {
        icon: '/next_myfin/favicon.ico',
        apple: '/next_myfin/favicon.ico',
    },
};

export default function RootLayout({ children }) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/next_myfin/sw.js');
    }

    return (
        <html lang="en">
            <Head>
                <link rel="manifest" href="/next_myfin/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <link rel="apple-touch-icon" href="/next_myfin/logoOriginal.png" />
            </Head>
            <body className="container">
                {children}
            </body>
        </html>
    );
}
