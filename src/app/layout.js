import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
    title: "LiVi Analytics",
    description: "Додаток для фінансів",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
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
