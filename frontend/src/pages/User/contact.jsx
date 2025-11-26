import React, { useState } from 'react';
// Note: Removed unused import for external API/axios if you were using it
import '../../styles/ContactUs.css'; 

// 🚨 FORMSPREE ENDPOINT INTEGRATED HERE!
const FORMSPREE_URL = 'https://formspree.io/f/xnnyagyb'; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 THE FIX: Uses fetch to submit data to Formspree
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sends the form data
      });

      if (response.ok) {
        console.log('Form Submitted to Formsppree:', formData);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        
        // Clear success message after 3 seconds
        setTimeout(() => setStatus(''), 3000);
      } else {
        // Log Formspree error and set error status
        console.error('Formsppree submission failed:', response.status);
        setStatus('error');
        
        // Clear error message after 3 seconds
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      setStatus('error');
      
      // Clear error message after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="main-content">
      <div className="contact-section text-center">
        <div className="d-flex justify-content-center">
          <div className="contact-logo">
            <img src="/logo.png" alt="Aurevra Logo" />
          </div>
        </div>

        <h2 className="contact-title">CONTACT US</h2>

        <form className="contact-form mx-auto" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="4"
              required
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'SENDING...' : 'SUBMIT'}
          </button>
          
          {status === 'success' && (
            <p className="text-success mt-3">✓ Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-danger mt-3">✗ Failed to send message. Please try again.</p>
          )}
        </form>

        <div className="contact-info mt-5">
          <p>
            <i className="fas fa-phone"></i> 
            09123456789
          </p>
          <p>
            <i className="fas fa-envelope"></i> 
            aurevrajewelry@gmail.com
          </p>
          <div className="social-icons mt-3">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a> 
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a> 
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;