import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api";
import axios from "axios";
import "../../styles/shop.css";
import AuthPromptModal from "../../components/AuthPromptModal";
import { useToast } from "../../components/ToastProvider";
import getFallbackImage from "../../utils/imageFallback";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 NEW: State for Categories
  const [selectedCategory, setSelectedCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^uploads[\\/]/, "");
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      let productsList = [];
      if (Array.isArray(res.data)) {
        productsList = res.data;
      } else if (res.data.products && Array.isArray(res.data.products)) {
        productsList = res.data.products;
      }
      setProducts(productsList);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    }
    setLoading(false);
  };

  const addToCart = async (productId) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(
        "/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.show("Added to cart!", { type: "success" });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.show("Failed to add to cart", { type: "danger" });
    }
  };

  // 👇 NEW: Filter Logic (Category + Search)
  const categories = ["All", ...new Set(products.map(p => p.category || "Uncategorized"))];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="shop-page">
      <div className="app-container">
        <h2 className="page-title">
          {searchQuery ? `Search: "${searchQuery}"` : "All Jewelry"}
        </h2>

        {/* 👇 NEW: SHOP LAYOUT WRAPPER */}
        <div className="shop-layout">
          
          {/* 1. SIDEBAR */}
          <aside className="shop-sidebar">
            <h3 className="sidebar-header">Categories</h3>
            <ul className="category-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button 
                    className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* 2. MAIN GRID AREA */}
          <div className="shop-main">
            {loading ? (
              <p className="text-center">Loading items...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center" style={{ padding: '40px' }}>
                <h3>No products found.</h3>
                <p>Try clearing filters or check back later!</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((p) => (
                  <div className="product-card card" key={p._id}>
                    <div className="card-media">
                      <img
                        src={getImageUrl(p.image)}
                        onError={(e) => (e.target.src = getFallbackImage(p.name))}
                        alt={p.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="card-body">
                      <h4>{p.name}</h4>
                      <div className="meta">
                        <p className="price">₱{(p.price || 0).toLocaleString("en-PH")}</p>
                      </div>
                      <p className="muted" style={{ fontSize: '0.9rem' }}>
                        {p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + "..." : p.description) : ""}
                      </p>

                      <div className="product-actions">
                        <button className="btn btn-primary" onClick={() => addToCart(p._id)}>
                          Add to cart
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate(`/product/${p._id}`)}>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div> {/* End shop-layout */}

        <AuthPromptModal
          show={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </div>
    </div>
  );
}