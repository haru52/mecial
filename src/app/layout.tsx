import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { Header } from "~/app/_components/header";
import type { Metadata } from "next";

import { clsx } from "clsx";
import { getServerAuthSession } from "~/server/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Mecial",
    default: "Mecial",
  },
  description: "メタSNS。",
  // metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="ja">
      <body className={`font-sans ${inter.variable}`}>
        <Header />
        <main
          className={clsx({ "container prose mx-auto px-4": session !== null })}
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
