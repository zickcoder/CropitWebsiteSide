import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#141416",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "cropitGIF • Minimalist In-Browser GIF Recorder",
  description:
    "Crop any area of your browser tab and record it straight into a lightweight GIF—100% locally with zero bloat.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "cropitGIF • Minimalist In-Browser GIF Recorder",
    description:
      "Crop any area of your browser tab and record it straight into a lightweight GIF—100% locally with zero bloat.",
    url: "https://cropitgif.vercel.app",
    siteName: "cropitGIF",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#141416] text-[#FAFAFA] antialiased selection:bg-[#F59E0B]/20 selection:text-[#FAFAFA]">
        {children}
      </body>
    </html>
  );
}
