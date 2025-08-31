import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "МАФІН",
  description: "Додаток для фінансів",
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
