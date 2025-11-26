import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';
import axios from 'axios'; // You can actually just use API for everything to be clean!
import { useToast } from '../../components/ToastProvider';
import getFallbackImage from '../../utils/imageFallback';
import AuthPromptModal from '../../components/AuthPromptModal';
import '../../styles/product.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  // specific state for wishlist loading so user doesn't spam click
  const [wishlistLoading, setWishlistLoading] = useState(false); 
  
  const token = localStorage.getItem('token');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch Product
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.product || res.data); 
      } catch (err) {
        console.error('Failed to load product:', err);
        toast.show('Failed to load product', { type: 'danger' });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle Quantity Change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  // --- 🛒 ADD TO CART LOGIC ---
  const addToCart = async () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      await axios.post(
        '/api/cart/add',
        { productId: product._id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.show('Added to cart ✨', { type: 'success' });
    } catch (err) {
      console.error('Add to cart error', err);
      toast.show('Failed to add to cart', { type: 'danger' });
    }
  };

  // --- 💖 ADD TO WISHLIST LOGIC (The Fix!) ---
  const addToWishlist = async () => {
    if (!token) {
        setShowLoginPrompt(true);
        return;
    }
    
    setWishlistLoading(true);
    try {
        // I'm assuming your endpoint is /wishlist/add based on your cart logic
        // If it's different in your backend, change this URL!
        await API.post('/wishlist/add', { productId: product._id });
        
        toast.show('Added to Wishlist 💖', { type: 'success' });
    } catch (err) {
        console.error('Wishlist error:', err);
        // Check if it's already in wishlist to give a specific message
        if (err.response && err.response.data.message) {
             toast.show(err.response.data.message, { type: 'info' });
        } else {
             toast.show('Failed to add to wishlist', { type: 'danger' });
        }
    } finally {
        setWishlistLoading(false);
    }
  };

  // Buy Now Logic
  const handleBuyNow = () => {
    if (!token) {
        setShowLoginPrompt(true);
        return;
    }
    addToCart(); 
    navigate('/cart');
  };

  if (loading) return <div className="app-container"><p>Loading...</p></div>;
  if (!product) return <div className="app-container"><p>Product not found.</p></div>;

  return (
    <div className="product-page-wrapper">
      <div className="product-detail-container">
        
        {/* LEFT SIDE: IMAGE */}
        <div className="product-image-section">
          <div className="image-card">
             <img
                src={`http://localhost:5000/uploads/${product.image}`}
                onError={(e) => (e.target.src = getFallbackImage(product.name))}
                alt={product.name}
             />
          </div>
        </div>

        {/* RIGHT SIDE: INFO */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <p className="product-price">
            ₱{(product.price || 0).toLocaleString('en-PH')}
          </p>

          <div className="quantity-section">
            <label>Quantity</label>
            <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange}
                className="qty-input"
            />
          </div>

          <div className="action-buttons">
            <button className="btn-action btn-buy-now" onClick={handleBuyNow}>
                <i className="fas fa-bolt"></i> Buy Now
            </button>

            <button className="btn-action btn-add-cart" onClick={addToCart}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>

            {/* 👇 ATTACHED THE FUNCTION HERE! */}
            <button 
                className="btn-action btn-wishlist" 
                onClick={addToWishlist}
                disabled={wishlistLoading} // prevent spam clicking
            >
                <i className={`fas fa-heart ${wishlistLoading ? 'fa-pulse' : ''}`}></i> 
                {wishlistLoading ? ' Adding...' : ' Add to Wishlist'}
            </button>
          </div>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>

        </div>
      </div>

      <AuthPromptModal
        show={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    </div>
  );
}