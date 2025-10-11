import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import getConfig from 'next/config';

export const metadata = {
    title: "LiVi Analytics",
    description: "Додаток для фінансів",
    icons: {
        icon: getConfig.name['assetPrefix']+'favicon.ico',
        apple: getConfig.name['assetPrefix']+'apple-icon.ico',
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">
        {children}
      </body>
    </html>
  );
}
