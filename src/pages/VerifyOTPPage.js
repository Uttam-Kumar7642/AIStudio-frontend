import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { passwordAPI } from '../utils/api';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => { if (!email) navigate('/forgot-password'); }, [email, navigate]);
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split('').forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return toast.error('Please enter the complete 6-digit OTP.');
    setLoading(true);
    try {
      const { data } = await passwordAPI.verifyOTP(email, otpString);
      toast.success('OTP verified!');
      navigate('/reset-password', { state: { email, resetToken: data.resetToken } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await passwordAPI.resendOTP(email);
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP.');
    } finally { setResending(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 'min(420px, 100%)', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', background: 'rgba(108,99,255,0.15)', border: '2px solid var(--border-strong)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={24} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Enter OTP</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            We sent a 6-digit code to<br /><strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
          {otp.map((digit, index) => (
            <input key={index} ref={el => inputRefs.current[index] = el}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              style={{
                width: '52px', height: '60px', textAlign: 'center', fontSize: '24px', fontWeight: '800',
                fontFamily: 'var(--font-mono)', background: digit ? 'rgba(108,99,255,0.12)' : 'var(--bg-input)',
                border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '12px',
                color: 'var(--text-primary)', outline: 'none', transition: 'all 0.15s ease', cursor: 'text',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
              onBlur={e => { if (!digit) e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleVerify}
          disabled={!otp.every(d => d !== '') || loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginBottom: '20px' }}>
          {loading ? <><div className="spinner" />Verifying...</> : <><ShieldCheck size={16} />Verify OTP</>}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Didn't receive the code?</p>
          {canResend ? (
            <button className="btn btn-ghost" onClick={handleResend} disabled={resending}
              style={{ fontSize: '13px', color: 'var(--accent-light)', padding: '6px 12px' }}>
              {resending ? <><div className="spinner" style={{ width: '14px', height: '14px' }} />Sending...</> : <><RefreshCw size={14} />Resend OTP</>}
            </button>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Resend in <span style={{ color: 'var(--accent)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                {String(Math.floor(countdown / 60)).padStart(2, '0')}:{String(countdown % 60).padStart(2, '0')}
              </span>
            </p>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <Link to="/forgot-password" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <ArrowLeft size={14} /> Use a different email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
