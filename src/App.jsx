import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import Buildings from "./pages/Buildings";
import BuildingDetail from "./pages/BuildingDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import WhatWeDo from "./pages/WhatWeDo";
import Board from "./pages/Board";
import Gallery from "./pages/Gallery";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import HeroSettings from "./pages/admin/HeroSettings";
import BuildingsManager from "./pages/admin/BuildingsManager";
import BuildingForm from "./pages/admin/BuildingForm";
import BuildingTypesManager from "./pages/admin/BuildingTypesManager";
import ProductsManager from "./pages/admin/ProductsManager";
import ProductForm from "./pages/admin/ProductForm";
import ProductCategoriesManager from "./pages/admin/ProductCategoriesManager";
import GalleryManager from "./pages/admin/GalleryManager";
import ServicesManager from "./pages/admin/ServicesManager";
import BoardManager from "./pages/admin/BoardManager";
import BlogManager from "./pages/admin/BlogManager";
import BlogForm from "./pages/admin/BlogForm";
import Inquiries from "./pages/admin/Inquiries";
import BackToTop from "./components/BackToTop";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Preloader />
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route
          path="/"
          element={
            <SiteLayout>
              <Home />
            </SiteLayout>
          }
        />
        <Route
          path="/buildings"
          element={
            <SiteLayout>
              <Buildings />
            </SiteLayout>
          }
        />
        <Route
          path="/buildings/:slug"
          element={
            <SiteLayout>
              <BuildingDetail />
            </SiteLayout>
          }
        />
        <Route
          path="/products"
          element={
            <SiteLayout>
              <Products />
            </SiteLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <SiteLayout>
              <ProductDetail />
            </SiteLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <SiteLayout>
              <Gallery />
            </SiteLayout>
          }
        />
        <Route
          path="/what-we-do"
          element={
            <SiteLayout>
              <WhatWeDo />
            </SiteLayout>
          }
        />
        <Route
          path="/board"
          element={
            <SiteLayout>
              <Board />
            </SiteLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <SiteLayout>
              <Blog />
            </SiteLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <SiteLayout>
              <BlogPost />
            </SiteLayout>
          }
        />
        <Route
          path="/about"
          element={
            <SiteLayout>
              <About />
            </SiteLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <SiteLayout>
              <Contact />
            </SiteLayout>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroSettings />} />
          <Route path="buildings" element={<BuildingsManager />} />
          <Route path="buildings/:id" element={<BuildingForm />} />
          <Route path="building-types" element={<BuildingTypesManager />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route
            path="product-categories"
            element={<ProductCategoriesManager />}
          />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="board" element={<BoardManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="blog/:id" element={<BlogForm />} />
          <Route path="inquiries" element={<Inquiries />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
