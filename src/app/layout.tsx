import { Modal, Snackbar } from "@/components/";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Magic Board</title>
      </head>
      <body>
          <Modal />
          <Snackbar />
          {children}
      </body>
    </html>
  );
}