import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { Header } from "~/app/_components/header";
import { Footer } from "./_components/footer";
import type { Metadata } from "next";

import { clsx } from "clsx";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

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
  const user =
    session === null ? null : await api.user.getById(session.user.id);
  const currentSocial =
    user?.currentSocialId == null
      ? null
      : await api.social.getById(user.currentSocialId);

  return (
    <html lang="ja">
      <body className={`font-sans ${inter.variable}`}>
        <Header user={user} currentSocial={currentSocial} />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Footer />
      </body>
    </html>
  );
}
