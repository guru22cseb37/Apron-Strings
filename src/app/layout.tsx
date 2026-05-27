import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import SmoothScroll from "@/components/SmoothScroll";
import AudioPlayer from "@/components/AudioPlayer";
import AromaVisualizer from "@/components/AromaVisualizer";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import GourmetConcierge from "@/components/GourmetConcierge";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export const metadata: Metadata = {
  title: "Apron Strings | Luxury Artisan Cakes & Handcrafted Pastries",
  description: "Experience the art of fine baking at Apron Strings. Specialty designer cakes, gourmet pastries, cupcakes, sea-salt cookies, fudge brownies, and luxury celebration hampers.",
  keywords: ["bakery", "artisan cakes", "pastries", "cupcakes", "luxury dessert", "celebration hampers", "apron strings", "custom cakes"],
  openGraph: {
    title: "Apron Strings | Luxury Artisan Cakes & Handcrafted Pastries",
    description: "Handcrafted artisan dessert experience tailored with modern elegance.",
    images: ["/images/hero-cake.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <AppProvider>
          <ScrollProgressBar />
          <BackgroundAtmosphere />
          <div className="noise-overlay" />
          <SmoothScroll>
            <AudioPlayer />
            <AromaVisualizer />
            <GourmetConcierge />
            <ExitIntentPopup />
            {children}
          </SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
