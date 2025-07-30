import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth/AuthContext';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import ProviderAvailability from './pages/ProviderAvailability';
import Navbar from './components/Navbar';
import MyAvailability from './pages/MyAvailability';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/book"
              element={<ProtectedRoute role="CUSTOMER"><BookAppointment /></ProtectedRoute>}
            />
            <Route
              path="/availability"
              element={<ProtectedRoute role="PROVIDER"><ProviderAvailability /></ProtectedRoute>}
            />
            <Route
              path="/my-availability"
              element={<ProtectedRoute role="PROVIDER"><MyAvailability /></ProtectedRoute>}
            />
            <Route path="/payment-success" element={<ProtectedRoute role="CUSTOMER"><PaymentSuccess /></ProtectedRoute>} />
            <Route path="/payment-failed" element={<ProtectedRoute role="CUSTOMER"><PaymentFailed /></ProtectedRoute>} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
