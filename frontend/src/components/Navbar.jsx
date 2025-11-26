import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css"; 

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const token = localStorage.getItem("token");

  // 🌙 Dark Mode Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  // 🛒 Fetch Cart Count
  useEffect(() => {
    if (token) {
        axios.get("/api/cart/me", { headers: { Authorization: `Bearer ${token}` } })
             .then(res => {
                 const count = res.data.items ? res.data.items.length : 0;
                 setCartCount(count);
             })
             .catch(err => console.log("Cart count error", err));
    }
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  // 👇 THIS IS THE REDIRECT LOGIC YOU ASKED FOR! 💅
  const handleProfileClick = () => {
    if (token) {
      // If user is logged in, go to Profile
      navigate("/user/profile");
    } else {
      // If user is a GUEST (no token), go to Login!
      navigate("/user/login");
    }
  };

  return (
    <nav className="navbar">
      {/* 1. Logo Section */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Aurevra" className="nav-logo" /> 
        <span className="brand-text">AUREVRA JEWELRY</span>
      </div>

      {/* 2. Center Links */}
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/shop">SHOP</Link>
        <Link to="/about">ABOUT US</Link>
        <Link to="/wishlist">WISHLIST</Link>
        <Link to="/contact">CONTACT US</Link>
      </div>

      {/* 3. Right Icons & Search */}
      <div className="navbar-actions">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-box">
          <input 
            type="text" 
            placeholder="Search jewelry..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><i className="fas fa-search"></i></button>
        </form>

        {/* 👇 User Icon attached to the handleProfileClick function */}
        <div className="nav-icon user-icon" onClick={handleProfileClick} title="Profile">
           <i className="fas fa-user"></i>
        </div>

        {/* Cart Icon */}
        <div className="nav-icon cart-icon" onClick={() => navigate("/cart")} title="Cart">
           <i className="fas fa-shopping-cart"></i>
           {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>

        {/* Dark Mode Toggle */}
        <div className="nav-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
           <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </div>

      </div>
    </nav>
  );
}