
import "./globals.css";

export const metadata = {
  title: "Clima App",
  description: "Consulta el clima actual y el pronóstico del tiempo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

export const viewport = {
  themeColor: "#e53935",
};