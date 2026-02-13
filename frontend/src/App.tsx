import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// ============ LAZY-LOADED PAGES ============
// Public pages
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./components/Auth'));
const About = lazy(() => import('./pages/About'));
const Register = lazy(() => import('./pages/Register'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Reservation = lazy(() => import('./pages/Reservation'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Menu = lazy(() => import('./pages/Menu'));
const ScanOrder = lazy(() => import('./pages/ScanOrder'));
const ScanAndPay = lazy(() => import('./pages/ScanAndPay'));
const GuestOrder = lazy(() => import('./pages/GuestOrder'));
const GuestCheckout = lazy(() => import('./pages/GuestCheckout'));
const OrderStatus = lazy(() => import('./pages/OrderStatus'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages (separate chunk)
const AdminMenu = lazy(() => import('./pages/admin/modules/Menu'));
const OrdersManagement = lazy(() => import('./pages/OrdersManagement'));
const AIAnalytics = lazy(() => import('./pages/admin/AIAnalytics'));
const AdminTables = lazy(() => import('./pages/admin/modules/Tables'));
const AdminReservations = lazy(() => import('./pages/admin/modules/Reservations'));
const AdminStaff = lazy(() => import('./pages/admin/modules/Staff'));
const AdminPayments = lazy(() => import('./pages/admin/modules/Payments'));
const AdminFeedback = lazy(() => import('./pages/admin/modules/Feedback'));
const AdminReports = lazy(() => import('./pages/admin/modules/Reports'));
const AdminSettings = lazy(() => import('./pages/admin/modules/Settings'));
const CompleteAdminDashboard = lazy(() => import('./pages/CompleteAdminDashboard'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));

// Loading Fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="text-center">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
  <p className="text-gray-600">Loading...</p>
  </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <Navbar />
    <div className="pt-16">
    <Suspense fallback={<PageLoader />}>
    <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/reservation" element={<Reservation />} />
    <Route path="/reviews" element={<Reviews />} />
    <Route path="/register" element={<Register />} />
    <Route path="/scan-order" element={<ScanOrder />} />
    <Route path="/scan-pay" element={<ScanAndPay />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/my-orders" element={<MyOrders />} />
    <Route path="/guest-order" element={<GuestOrder />} />
    <Route path="/guest-checkout" element={<GuestCheckout />} />
    <Route path="/order-status/:orderNumber" element={<OrderStatus />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/edit" element={<EditProfile />} />

    {/* Admin Routes */}
    <Route
    path="/admin/*"
    element={
      <PrivateRoute role="admin">
      <Routes>
      <Route path="menu" element={<AdminMenu />} />
      <Route path="orders" element={<OrdersManagement />} />
      <Route path="tables" element={<AdminTables />} />
      <Route path="ai-analytics" element={<AIAnalytics />} />
      <Route path="reservations" element={<AdminReservations />} />
      <Route path="staff" element={<AdminStaff />} />
      <Route path="payments" element={<AdminPayments />} />
      <Route path="feedback" element={<AdminFeedback />} />
      <Route path="reports" element={<AdminReports />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="dashboard" element={<CompleteAdminDashboard />} />
      <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      </PrivateRoute>
    }
    />

    {/* 404 - Catch all unknown routes */}
    <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
    <Footer />
    </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
    <Router>
    <ScrollToTop />
    <AppRoutes />
    </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
