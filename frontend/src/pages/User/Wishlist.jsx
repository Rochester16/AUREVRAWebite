import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthPromptModal from '../../components/AuthPromptModal';
import getFallbackImage from '../../utils/imageFallback';
import { useToast } from '../../components/ToastProvider';
import Skeleton from '../../components/Skeleton';
import ConfirmModal from '../../components/ConfirmModal';
import "../../styles/wishlist.css"; // Import new CSS

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Helper for images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^uploads[\\/]/, "");
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  useEffect(() => {
    const load = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/wishlist/me", { headers: { Authorization: `Bearer ${token}` } });
          const items = (res.data && res.data.items) ? res.data.items.map(i => (i.product ? i.product : i)) : [];
          setWishlistItems(items);
        } catch (err) {
          console.error("Failed to load wishlist from server:", err);
          const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
          setWishlistItems(saved);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistItems(saved);
      }
      setLoading(false);
    };

    load();
  }, []);

  const handleRemove = (id) => {
      if (token) {
      axios.delete("/api/wishlist/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId: id }
      }).then(res => {
        const items = (res.data && res.data.items) ? res.data.items.map(i => (i.product ? i.product : i)) : [];
        setWishlistItems(items);
      }).catch(err => {
        console.error("Failed to remove from wishlist:", err);
          toast && toast.show("Failed to remove from wishlist", { type: 'error' });
      });
    } else {
      const updated = wishlistItems.filter(item => item._id !== id);
      setWishlistItems(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
        toast && toast.show("Removed from wishlist", { type: 'info' });
    }
  };

  const handleAddToCart = async (item) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      await axios.post(
        "/api/cart/add",
        { productId: item._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast && toast.show("Added to cart", { type: 'success' });
    } catch (err) {
      console.error("Error:", err);
      toast && toast.show("Failed to add to cart", { type: 'error' });
    }
  };

  const handleClearWishlist = () => {
    setConfirmMessage('Clear entire wishlist? This action cannot be undone.');
    setConfirmAction(() => async () => {
      if (token) {
        try {
          await axios.delete("/api/wishlist/clear", { headers: { Authorization: `Bearer ${token}` } });
          setWishlistItems([]);
          toast.show("Wishlist cleared", { type: 'info' });
        } catch (err) {
          console.error("Failed to clear wishlist:", err);
          toast.show("Failed to clear wishlist", { type: 'danger' });
        }
      } else {
        setWishlistItems([]);
        localStorage.setItem("wishlist", JSON.stringify([]));
        toast.show("Wishlist cleared", { type: 'info' });
      }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  if (loading) return (
    <div className="wishlist-page">
        <div className="app-container">
            <h2 className="page-title">My Wishlist</h2>
            <div className="products-grid">
                <div className="card"><Skeleton height={180} /></div>
                <div className="card"><Skeleton height={180} /></div>
                <div className="card"><Skeleton height={180} /></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="wishlist-page">
        <div className="app-container">
            <h2 className="page-title">My Wishlist ❤️</h2>

            {wishlistItems.length === 0 ? (
                <div className="empty-state">
                <h3>Your wishlist is empty.</h3>
                <p>Save items you love here to buy later!</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/shop") }>
                    Start Shopping
                </button>
                </div>
            ) : (
                <>
                <div className="products-grid">
                    {wishlistItems.map((item) => (
                    <div key={item._id} className="product-card card">
                        <div className="card-media">
                        <img 
                            src={getImageUrl(item.image)} 
                            onError={(e) => (e.target.src = getFallbackImage(item.name))}
                            alt={item.name} 
                            loading="lazy" 
                        />
                        </div>
                        <div className="card-body">
                        <h4>{item.name}</h4>
                        <div className="meta"><p className="price">₱{(item.price || 0).toLocaleString()}</p></div>
                        
                        <p className="muted">
                            {item.description ? (item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description) : ""}
                        </p>

                        <div className="product-actions">
                            <button className="btn btn-primary" onClick={() => handleAddToCart(item)}>Add to Cart</button>
                            <button className="btn btn-ghost" onClick={() => handleRemove(item._id)}>Remove</button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="center" style={{marginTop:40, textAlign: 'center'}}>
                    <button className="btn btn-ghost" onClick={handleClearWishlist} style={{color: '#d9534f', borderColor: '#d9534f'}}>
                        Clear Wishlist
                    </button>
                </div>
                </>
            )}
        </div>

        <AuthPromptModal
            show={showLoginPrompt}
            onClose={() => setShowLoginPrompt(false)}
        />

        <ConfirmModal
            open={confirmOpen}
            title="Confirm"
            message={confirmMessage}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => { if (confirmAction) confirmAction(); }}
        />
    </div>
  );
};

export default Wishlist;