import { headers } from "next/headers";
import "./globals.css";

const title = "Kevin Whinnery";
const description =
  "Kevin Whinnery is a marketing leader and developer experience expert based in Minneapolis, MN.";

// Metadata is intentionally colocated with the root layout.
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata() {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "kevin.mn";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    title,
    description,
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: title,
      url: baseUrl,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Kevin Whinnery",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
