import "~/styles/globals.css";

import { Noto_Sans_JP } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
});

const defaultTitle = "Mecial";

export const metadata: Metadata = {
  title: {
    template: `%s | ${defaultTitle}`,
    default: defaultTitle,
  },
  description: "メタSNS。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://mecial.haru52.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const user = session === null ? null : await api.user.getMe();
  const currentSocial =
    user?.currentSocialId == null
      ? null
      : await api.social.getById(user.currentSocialId);

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`font-sans ${notoSansJp.variable} flex min-h-screen flex-col`}
      >
        <TRPCReactProvider>
          <ThemeProvider>
            <Header user={user} currentSocial={currentSocial} />
            <main className="grow">{children}</main>
            <Footer />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
