import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../components/ToastProvider';
import Skeleton from '../../components/Skeleton';
import getFallbackImage from '../../utils/imageFallback';
import '../../styles/checkout.css'; // 🚨 NEW CSS IMPORTED

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "cod"
  });

  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const toast = useToast();

  // 🖼️ FIX: Helper to construct the full image path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^uploads[\\/]/, "");
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  useEffect(() => {
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/user/login');
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
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "/api/history/purchases/add/purchase",
        {
          items: cart.items,
          totalAmount: total,
          paymentMethod: formData.paymentMethod,
          shippingAddress: formData.address,
          customerEmail: formData.email,
          customerName: formData.fullName,
          customerPhone: formData.phone
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      

      // 2. Clear Cart
      await axios.delete("/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast && toast.show('Order placed — thank you!', { type: 'success' });
      navigate('/success');
    } catch (err) {
      console.error("Checkout error:", err);
      toast && toast.show('Failed to place order', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const total =
    cart?.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  // Render placeholder while loading
  if (!cart) {
    return (
      <div className="checkout-page-wrapper">
        <div className="app-container">
          <h2 className="page-title">Checkout</h2>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Handle empty cart scenario
  if (cart?.items?.length === 0) {
    return (
      <div className="checkout-page-wrapper">
        <div className="app-container empty-checkout">
          <h2 className="page-title">Checkout</h2>
          <p>Your cart is empty! Time to start shopping!</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Go to Shop
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="checkout-page-wrapper">
      <div className="app-container">
        <h2 className="page-title">Checkout</h2>

        {/* Replaced inline style with CSS class */}
        <div className="checkout-layout"> 
          
          {/* LEFT: SHIPPING FORM */}
          <div className="shipping-form-container card">
            <h3 className="section-title">Shipping & Payment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid"> {/* Replaced inline style with CSS class */}
                
                <label className="form-group">
                  Full Name
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </label>

                <label className="form-group">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </label>

                <label className="form-group">
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </label>

                <label className="form-group full-width">
                  Shipping Address
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="form-control"
                  />
                </label>

                <label className="form-group full-width">
                  Payment Method
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="gcash">GCash</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                </label>

                <button type="submit" className="btn btn-primary full-width mt-3" disabled={loading}>
                  {loading ? "Processing..." : `Place Order (₱${total.toLocaleString()})`}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="order-summary-sidebar card">
            <h5 className="summary-header">Order Summary</h5>

            <div className="item-list">
              {cart.items.map((item) => (
                // Use key from product ID for stability
                <div key={item.product?._id} className="summary-item"> 
                  
                  {/* Image with the Fix */}
                  <div className="item-img-container">
                    <img
                      src={getImageUrl(item.product?.image || item.product?.photo)} 
                      onError={(e) => (e.target.src = getFallbackImage(item.product?.name))}
                      alt={item.product?.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="item-details">
                    <div className="item-name">{item.product?.name}</div>
                    <div className="item-qty muted">Qty: {item.quantity}</div>
                  </div>

                  <div className="item-subtotal">
                    ₱
                    {(
                      (item.product?.price || 0) * item.quantity
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-footer">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="shipping-cost">FREE</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>₱{total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}