"use client";
import './globals.css';
import { Toaster } from "sonner";
// FontAwesome configuration
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

 export default  function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position='top-right' richColors/>
      </body>
    </html>
  );
}