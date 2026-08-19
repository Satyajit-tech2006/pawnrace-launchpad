// src/components/Layout.jsx

import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from './Loader';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-white selection:bg-yellow-400 selection:text-black">
      {/* Top Fixed 3D Navigation Bar */}
      <Navbar />

      {/* Main Content Area wrapped in Suspense for route lazy-loading */}
      <main className="flex-grow pt-20">
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </main>

      {/* 3D Interactive Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
export { Layout };