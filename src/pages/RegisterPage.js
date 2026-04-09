import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, Eye, EyeOff, Check, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../store/AuthContext';
import { registerAPI } from '../utils/api';

// ─── Step 1: Registration Form ────────────────────────────────────────────────
const RegisterForm = ({ onOTPSent }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { score: s, label: 'Weak', color: 'var(--accent-secondary)' };
    if (s <= 3) return { score: s, label: 'Fair', color: 'var(--accent-yellow)' };
    return { score: s, label: 'Strong', color: 'var(--accent-green)' };
  };

  const str = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const { data } = await registerAPI.sendOTP(form.name, form.email, form.password);
      toast.success('OTP sent to your email!');
      onOTPSent(form);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const perks = ['10 free AI generations/month', 'Resume & Blog generation', 'PDF export included', 'No credit card required'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '48px', flexWrap: 'wrap' }}>
      {/* Left: Perks */}
      <div className="fade-in" style={{ maxWidth: '320px', flex: '1 1 280px' }}>
        <div style={{ width: '52px', height: '52px', background: 'var(--accent)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 0 30px var(--accent-glow)' }}>
          <Sparkles size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '28px', marginBottom: '12px', letterSpacing: '-0.03em' }}>Start creating with AI today</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: '1.6' }}>
          Join thousands of professionals using AIStudio.
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {perks.map(p => (
            <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <div style={{ width: '20px', height: '20px', flexShrink: 0, background: 'rgba(67,217,162,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={12} color="var(--accent-green)" />
              </div>
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Form */}
      <div className="card fade-in fade-in-delay-1" style={{ width: '100%', maxWidth: '400px', flex: '1 1 340px' }}>
        <h1 style={{ fontSize: '22px', marginBottom: '24px' }}>Create your account</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="text" placeholder="Jane Smith"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={{ paddingLeft: '42px' }} autoComplete="name" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ paddingLeft: '42px' }} autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingLeft: '42px', paddingRight: '42px' }} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-ghost"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1,2,3,4,5].map(i => <div key={i} style={{ height: '3px', flex: 1, borderRadius: '2px', background: i <= str.score ? str.color : 'var(--bg-input)', transition: 'background 0.3s' }} />)}
                </div>
                <p style={{ fontSize: '11px', color: str.color }}>{str.label} password</p>
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
            {loading ? <><div className="spinner" />Sending OTP...</> : 'Continue with Email'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

// ─── Step 2: OTP Verification ─────────────────────────────────────────────────
const OTPVerification = ({ formData, onBack, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

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
      const { data } = await registerAPI.verifyOTP(formData.name, formData.email, formData.password, otpString);
      toast.success('Account created! Welcome to AIStudio 🎉');
      onSuccess(data.token, data.user);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await registerAPI.resendOTP(formData.email, formData.name);
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
      <div className="card fade-in" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={14} color="white" />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600' }}>Details</span>
          </div>
          <div style={{ flex: 1, height: '2px', background: 'var(--accent)', borderRadius: '1px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px var(--accent-glow)' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>2</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>Verify Email</span>
          </div>
          <div style={{ flex: 1, height: '2px', background: 'var(--border)', borderRadius: '1px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-input)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>3</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Done</span>
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', background: 'rgba(108,99,255,0.15)', border: '2px solid var(--border-strong)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={24} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Verify your email</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: 'var(--text-primary)' }}>{formData.email}</strong>
          </p>
        </div>

        {/* OTP Boxes */}
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

        {/* Verify Button */}
        <button className="btn btn-primary" onClick={handleVerify}
          disabled={!otp.every(d => d !== '') || loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginBottom: '20px' }}>
          {loading ? <><div className="spinner" />Creating Account...</> : <><ShieldCheck size={16} />Verify & Create Account</>}
        </button>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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

        {/* Back */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button className="btn btn-ghost" onClick={onBack}
            style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '6px 12px' }}>
            <ArrowLeft size={14} /> Edit my details
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Success Screen ───────────────────────────────────────────────────
const SuccessScreen = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <div style={{ width: '72px', height: '72px', background: 'rgba(67,217,162,0.15)', border: '2px solid rgba(67,217,162,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Check size={36} color="var(--accent-green)" />
      </div>
      <h1 style={{ fontSize: '26px', marginBottom: '10px' }}>Account Created!</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
        Your email is verified. Taking you to your dashboard...
      </p>
      <div style={{ width: '100%', height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--accent-green)', borderRadius: '2px', animation: 'progressBar 2s linear forwards' }} />
      </div>
      <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  </div>
);

// ─── Main RegisterPage ────────────────────────────────────────────────────────
const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: form, 2: otp, 3: success
  const [formData, setFormData] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleOTPSent = (data) => {
    setFormData(data);
    setStep(2);
  };

  const handleSuccess = (token, user) => {
    setStep(3);
    login(token, user);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (step === 3) return <SuccessScreen />;
  if (step === 2) return <OTPVerification formData={formData} onBack={() => setStep(1)} onSuccess={handleSuccess} />;
  return <RegisterForm onOTPSent={handleOTPSent} />;
};

export default RegisterPage;
