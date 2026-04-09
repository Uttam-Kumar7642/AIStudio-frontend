import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { passwordAPI } from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
    setLoading(true);
    try {
      const { data } = await passwordAPI.forgotPassword(email);
      setSent(true);
      toast.success('OTP sent! Check your inbox.');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 'min(420px, 100%)', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: sent ? 'rgba(67,217,162,0.15)' : 'var(--accent)',
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: sent ? '0 0 30px rgba(67,217,162,0.3)' : '0 0 30px var(--accent-glow)',
            transition: 'all 0.4s ease',
          }}>
            {sent ? <Send size={24} color="var(--accent-green)" /> : <Mail size={24} color="white" />}
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{sent ? 'OTP Sent!' : 'Forgot Password?'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            {sent ? `We sent a code to ${email}. Redirecting...` : "Enter your email and we'll send you a one-time password."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '42px' }} autoFocus />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
              {loading ? <><div className="spinner" />Sending OTP...</> : <><Send size={16} />Send OTP</>}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Redirecting to verification...</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
          <span style={{ color: 'var(--border)' }}>·</span>
          <Link to="/register" style={{ color: 'var(--accent-light)', fontSize: '13px' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
