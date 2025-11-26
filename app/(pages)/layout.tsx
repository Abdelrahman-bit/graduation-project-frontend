import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

export const metadata = {
   title: 'application layout',
};

export default function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <>
         <Header />

         {children}

         <Footer />
      </>
   );
}
