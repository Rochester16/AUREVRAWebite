import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../components/ToastProvider'; // Adjust path if needed
import ConfirmModal from '../../components/ConfirmModal';   // Adjust path if needed
import getFallbackImage from '../../utils/imageFallback';   // Adjust path if needed
import "../../styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);

  // Helper to fix image paths
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^uploads[\\/]/, "");
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/user/login");
      return;
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await axios.put(
        "/api/cart/update",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
      toast && toast.show('Cart updated', { type: 'info' });
    } catch (err) {
      console.error("Failed to update cart:", err);
      toast && toast.show('Failed to update cart', { type: 'error' });
    }
  };

  const removeItem = async (productId) => {
    setConfirmOpen(true);
    setPendingRemove(productId);
  };

  const doRemoveConfirmed = async () => {
    if (!pendingRemove) return;
    try {
      await axios.delete(
        "/api/cart/remove",
        {
          data: { productId: pendingRemove },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPendingRemove(null);
      setConfirmOpen(false);
      fetchCart();
      toast && toast.show('Removed from cart', { type: 'info' });
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast && toast.show('Failed to remove item', { type: 'error' });
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return <div className="app-container" style={{paddingTop:60}}><p>Loading cart...</p></div>;
  }

  // Filter out "Ghost" items where item.product is null
  const allItems = cart?.items || [];
  const validItems = allItems.filter(item => item.product !== null && item.product !== undefined);

  const total = validItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="cart-page-container">
      <h2 className="page-title">Your Shopping Cart</h2>

      {validItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-content">
             {/* Added a cute icon here so it's not just text! */}
             <i className="fas fa-shopping-basket empty-icon"></i>
             <h3>Your cart is currently empty</h3>
             <p>Looks like you haven't made your choice yet, bestie.</p>
             <button className="btn-primary mt-3" onClick={() => navigate("/shop") }>
               START SHOPPING
             </button>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          
          {/* LEFT: ITEMS LIST */}
          <div className="cart-items-list">
            {validItems.map((item) => (
              <div key={item.product._id} className="cart-item-card">
                
                {/* Image */}
                <div className="item-image">
                  <img 
                    src={getImageUrl(item.product.image)} 
                    onError={(e) => (e.target.src = getFallbackImage(item.product.name))}
                    alt={item.product.name} 
                  />
                </div>

                {/* Info */}
                <div className="item-details">
                  <h4 className="item-name">{item.product.name}</h4>
                  <p className="item-price">₱{(item.product.price || 0).toLocaleString()}</p>
                </div>

                {/* Right: Actions (Stacked Top-Down) */}
                <div className="item-actions">
                  <div className="qty-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >+</button>
                  </div>
                  
                  <button className="remove-btn" onClick={() => removeItem(item.product._id)}>
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <aside className="cart-sidebar">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₱{total.toLocaleString()}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </aside>

        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        onCancel={() => { setConfirmOpen(false); setPendingRemove(null); }}
        onConfirm={doRemoveConfirmed}
      />
    </div>
  );
}