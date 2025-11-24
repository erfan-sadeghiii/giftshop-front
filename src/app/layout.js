import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Icons from "./components/Icons";
import Footer from "./components/Footer";
import Header from "./components/Header";
import './styles/app.css';
import ClientProviders from "./components/clientProvider";
import AppInitializer from "./components/appInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TIXO GAME",
  description: "giftcard shop",
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" className="overflow-x-hidden" lang="fa">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
      >
        <Icons />

        {/* Only the dynamic providers need to be client */}
        <ClientProviders>
          <AppInitializer>

            <Header />
            {children}
          </AppInitializer>
        </ClientProviders>

        <Footer />
      </body>
    </html>
  );
}
