import { Providers } from '@/components/UI/Toaster';
import './globals.css';
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
      <body className='bg-white'>
        {children}
       <Providers/>
      </body>
    </html>
  );
}