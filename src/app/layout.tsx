import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "人格实验室 - 了解你的内在人格",
    template: "%s | 人格实验室",
  },
  description:
    "免费在线人格测试，深入了解回避型、边缘型、依赖型等九种人格类型。获取个性化改善建议和书籍推荐。",
  keywords: ["人格测试", "心理学", "回避型人格", "边缘型人格", "自我认知"],
  openGraph: {
    title: "人格实验室 - 了解你的内在人格",
    description: "免费在线人格测试，深入了解九种人格类型，获取个性化改善建议。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
