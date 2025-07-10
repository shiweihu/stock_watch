import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
     <html lang="en" className={roboto.variable}>
       <head>
        {/* 预加载 TradingView Widget 脚本 */}
        <link
          rel="preload"
          href="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
          as="script"
        />
      </head>
       <body>
        <AppRouterCacheProvider>
          <CssBaseline/>
          <ThemeProvider theme={theme}>
           {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
       </body>
     </html>
   );
  
}
