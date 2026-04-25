import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h2>Get in Touch</h2>
        <p>Have questions about ClassFlow? Our support team is here to help you automate your institution's success.</p>
      </header>

      <div className="contact-grid">
        <aside className="contact-info">
          <div className="info-card">
            <div className="icon-box">
              <Mail size={24} />
            </div>
            <div className="info-content">
              <h4>Email Us</h4>
              <p>support@classflow.edu</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon-box">
              <Phone size={24} />
            </div>
            <div className="info-content">
              <h4>Call Support</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon-box">
              <MapPin size={24} />
            </div>
            <div className="info-content">
              <h4>Visit Us</h4>
              <p>Pilathara, Kannur, Kerala</p>
            </div>
          </div>

          <div className="info-card">
            <div className="icon-box">
              <Globe size={24} />
            </div>
            <div className="info-content">
              <h4>Social Presence</h4>
              <p>@classflow_edu</p>
            </div>
          </div>
        </aside>

        <section className="contact-form-container">
          <h3 className="form-title">Send us a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-input-group full-width">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject" 
                placeholder="How can we help?" 
                value={formData.subject}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-input-group full-width">
              <label>Message</label>
              <textarea 
                name="message" 
                rows="5" 
                placeholder="Write your message here..." 
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="send-btn">
              <Send size={20} />
              <span>Send Message</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
