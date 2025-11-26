import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastProvider } from "./components/ToastProvider.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";

// USER PAGES
import LoginPage from "./pages/User/LoginPage.jsx";
import RegisterPage from "./pages/User/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/User/ForgotPassword.jsx";
import ChangePasswordPage from "./pages/User/ChangePasswordPage.jsx";
import HomePage from "./pages/User/HomePage.jsx";
import ShopPage from "./pages/User/shop.jsx"; 
import ProductDetail from "./pages/User/ProductDetail.jsx";
import AboutUs from "./pages/User/aboutus.jsx";
import ContactUs from "./pages/User/contact.jsx";

// PROTECTED USER PAGES
import Cart from "./pages/User/cart.jsx";
import Checkout from "./pages/User/checkout.jsx";
import Success from "./pages/User/success.jsx";
import Wishlist from "./pages/User/Wishlist.jsx";
import MyPurchases from "./pages/User/MyPurchases.jsx";
import MyAccount from "./pages/User/MyAccount.jsx";

// ADMIN PAGES
import DashboardPage from "./pages/Admin/DashboardPage.jsx";
import ProductsPage from "./pages/Admin/ProductsPage.jsx";
import AddProductPage from "./pages/Admin/AddProductPage.jsx";
import ProductHistory from "./pages/Admin/ProductHistory.jsx";
import PurchaseHistory from "./pages/Admin/PurchaseHistory.jsx";
import UserCreatedHistory from "./pages/Admin/UserCreatedHistory.jsx";

// LAYOUT
import UserLayout from "./components/UserLayout.jsx";

// 🔄 Scroll to Top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

/* ==============================
   GET USER
================================*/
function getUser() {
  try {
    const data = JSON.parse(localStorage.getItem("user"));
    return data || null;
  } catch {
    return null;
  }
}

/* ==============================
   ROUTE PROTECTORS
================================*/
function UserRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/user/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

/* ==============================
   MAIN ROUTER
================================*/
function Layout() {
  return (
    <Routes>

      {/* ============================== */}
      {/* 🔓 PUBLIC ROUTES               */}
      {/* ============================== */}

      {/* AUTH */}
      <Route path="/user/login" element={<LoginPage />} />
      <Route path="/user/register" element={<RegisterPage />} />
      <Route path="/user/forgot-password" element={<ForgotPasswordPage />} />

      {/* ✅ NEW RESET PASSWORD ROUTE */}
      <Route path="/user/reset-password" element={<ChangePasswordPage />} />

      {/* BROWSING */}
      <Route 
        path="/" 
        element={<UserLayout><HomePage /></UserLayout>}
      />
      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route 
        path="/shop" 
        element={<UserLayout><ShopPage /></UserLayout>}
      />
      <Route 
        path="/product/:id" 
        element={<UserLayout><ProductDetail /></UserLayout>}
      />
      <Route 
        path="/about" 
        element={<UserLayout><AboutUs /></UserLayout>}
      />
      <Route 
        path="/contact" 
        element={<UserLayout><ContactUs /></UserLayout>}
      />

      {/* ============================== */}
      {/* 🔒 USER PROTECTED ROUTES       */}
      {/* ============================== */}

      <Route
        path="/cart"
        element={
          <UserRoute>
            <UserLayout><Cart /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <UserRoute>
            <UserLayout><Checkout /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <UserRoute>
            <UserLayout><Wishlist /></UserLayout>
          </UserRoute>
        }
      />

      {/* Both URLs lead to MyAccount */}
      <Route
        path="/account"
        element={
          <UserRoute>
            <UserLayout><MyAccount /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <UserRoute>
            <UserLayout><MyAccount /></UserLayout>
          </UserRoute>
        }
      />

      <Route
        path="/purchases"
        element={
          <UserRoute>
            <UserLayout><MyPurchases /></UserLayout>
          </UserRoute>
        }
      />
      <Route
        path="/success"
        element={
          <UserRoute>
            <UserLayout><Success /></UserLayout>
          </UserRoute>
        }
      />

      {/* ============================== */}
      {/* 🛡️ ADMIN ROUTES               */}
      {/* ============================== */}

      <Route
        path="/admin/dashboard"
        element={<AdminRoute><DashboardPage /></AdminRoute>}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute><ProductsPage /></AdminRoute>}
      />
      <Route
        path="/admin/products/add"
        element={<AdminRoute><AddProductPage /></AdminRoute>}
      />
      <Route
        path="/admin/products/edit/:id"
        element={<AdminRoute><AddProductPage /></AdminRoute>}
      />
      <Route
        path="/admin/products/history"
        element={<AdminRoute><ProductHistory /></AdminRoute>}
      />
      <Route
        path="/admin/purchase-history"
        element={<AdminRoute><PurchaseHistory /></AdminRoute>}
      />
      <Route
        path="/admin/users-created"
        element={<AdminRoute><UserCreatedHistory /></AdminRoute>}
      />

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
