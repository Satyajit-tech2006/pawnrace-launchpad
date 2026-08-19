import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes.jsx";
import Loader from "./components/Loader.jsx";

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  // First time app launch par ~1.5s ka smooth 3D pawn load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;