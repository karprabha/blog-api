import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "@/context/AuthProvider";

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
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
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
