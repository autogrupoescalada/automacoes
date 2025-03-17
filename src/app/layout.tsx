import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@utils/supabase/check-env-vars";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link"; 
import "@/styles/globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Automações | Grupo Escalada",
  description: "Grupo Escalada",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center ">
            <div className="flex-1 min-w-screen w-full flex flex-col items-center justify-between">

              <nav className="w-full flex flex-1 justify-between border-b border-b-foreground/10 max-h-16">
                <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}> Gestor de Automações </Link>
                  </div>
                  <div className="flex gap-2 items-end">
                    <ThemeSwitcher />
                    {hasEnvVars && <HeaderAuth />}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col min-w-full justify-center items-center">
                {children}
              </div>

              <footer className="w-full flex flex-1 items-center justify-center border-t mx-auto text-center text-xs gap-8 py-7 max-h-16">
                <p>
                  Desenvolvido por{" "}
                  <a
                    href="#"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Grupo Escalada
                  </a>
                </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
