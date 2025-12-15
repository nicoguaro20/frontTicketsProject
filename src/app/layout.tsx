import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Tickets App",
  description: "Portal de seguimiento de incidencias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-100 flex flex-col">

        {/* NAVBAR */}
        <nav className="w-full bg-[#F45858] text-white px-6 py-3 flex items-center gap-6 shadow-md">
          <img
            src="https://res.cloudinary.com/dzzurd9al/image/upload/v1765505385/logoParqueExplora_iapiws.jpg"
            alt="Logo Parque Explora"
            className="h-10 w-auto"
          />

          <div className="flex gap-6 text-lg font-medium">
            <a
              href="https://www.parqueexplora.org/tienda/boleteria"
              className="hover:underline"
            >
              Home
            </a>

            <Link href="/tickets" className="hover:underline">
              Tickets
            </Link>
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-[#44444A] flex items-center justify-center py-6">
          <img
            src="https://res.cloudinary.com/dzzurd9al/image/upload/v1765505764/imagenExploraGris_ueibcn.jpg"
            alt="Logo gris Parque Explora"
            className="h-12 w-auto"
          />
        </footer>

      </body>
    </html>
  );
}
