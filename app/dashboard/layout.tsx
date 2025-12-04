'use client';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Footer from '../components/dashboard/Footer';
import RouteGuard from '../components/auth/RouteGuard';
import useBearStore from '@/app/store/useStore';
import { useEffect } from 'react';

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { user, initializeAuth } = useBearStore();

   useEffect(() => {
      initializeAuth();
   }, [initializeAuth]);

   const userRole = user?.role || 'student';

   return (
      <>
         <RouteGuard type="protected" />
         <div className="min-h-screen bg-gray-50 flex">
            <Sidebar role={userRole} />
            <div className="flex-1 flex flex-col ml-64 min-h-screen transition-all duration-300">
               <Header />
               <main className="flex-1 p-8 overflow-y-auto">{children}</main>
               <Footer />
            </div>
         </div>
      </>
   );
}
