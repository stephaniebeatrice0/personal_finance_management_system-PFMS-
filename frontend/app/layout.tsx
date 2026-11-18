import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { IBM_Plex_Serif } from "next/font/google";
import { cn } from "@/lib/utils";

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = { title: "Money Manager" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", plexSerif.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Theme
          appearance="light"
          accentColor="teal"
          grayColor="slate"
          radius="large"
          scaling="105%"
          panelBackground="solid"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
