import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "@/context/AuthProvider";
import Script from "next/script";

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CodeGeekCentral - Learn, Code, and Share",
    description:
        "Explore a world of coding, tech tutorials, and programming knowledge at CodeGeekCentral. Stay updated with the latest trends and insights in the world of technology.",
    keywords:
        "coding, programming, tech tutorials, web development, software engineering, technology trends",
    authors: [{ name: "Prabhakar Yadav" }],
    icons: {
        icon: "favicon.ico",
    },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GOOGLE_ADSENSE_CA_PUB_ID =
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CA_PUB_ID;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CA_PUB_ID}`}
                crossOrigin="anonymous"
            ></Script>

            <body className={roboto.className}>
                <AuthProvider>
                    <Header />
                    <main className="h-full bg-gray-100">
                        <div className="max-w-7xl m-auto">{children}</div>
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
