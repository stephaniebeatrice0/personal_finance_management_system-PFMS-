import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Old_Standard_TT } from "next/font/google";

const oldStandard = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-old-standard",
  display: "swap",
});

export const metadata: Metadata = { title: "Money Manager" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Theme
          appearance="light"
          accentColor="teal"
          grayColor="slate"
          radius="medium"
          scaling="105%"
          panelBackground="solid"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
