import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner"; // Using sonner as seen in AuthModal
import AppRoutes from "./routes/AppRoutes.jsx"; // Centralized routes

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;

