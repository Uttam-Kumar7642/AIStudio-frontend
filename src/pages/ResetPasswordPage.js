import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { passwordAPI } from '../utils/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (!email || !resetToken) navigate('/forgot-password'); }, [email, resetToken, navigate]);

  const strength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++; if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { score: s, label: 'Weak', color: 'var(--accent-secondary)' };
    if (s <= 3) return { score: s, label: 'Fair', color: 'var(--accent-yellow)' };
    return { score: s, label: 'Strong', color: 'var(--accent-green)' };
  };

  const str = strength();
  const match = form.password && form.confirm && form.password === form.confirm;
  const noMatch = form.confirm && form.password !== form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await passwordAPI.resetPassword(email, resetToken, form.password);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password.');
      if (err.response?.status === 400) setTimeout(() => navigate('/forgot-password'), 2000);
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 'min(400px, 100%)', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', background: 'rgba(67,217,162,0.15)', border: '2px solid rgba(67,217,162,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} color="var(--accent-green)" />
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>Password Reset!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
          Your password has been updated. Redirecting to login...
        </p>
        <div style={{ width: '100%', height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--accent-green)', borderRadius: '2px', animation: 'progressBar 2.5s linear forwards' }} />
        </div>
        <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 'min(420px, 100%)', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--accent)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px var(--accent-glow)' }}>
            <Lock size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Set New Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            For <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="label">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingLeft: '42px', paddingRight: '42px' }} autoFocus />
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

          <div>
            <label className="label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                style={{ paddingLeft: '42px', paddingRight: '42px', borderColor: noMatch ? 'var(--accent-secondary)' : match ? 'var(--accent-green)' : undefined }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="btn btn-ghost"
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px' }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {noMatch && <p style={{ fontSize: '12px', color: 'var(--accent-secondary)', marginTop: '6px' }}>Passwords do not match</p>}
            {match && <p style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Passwords match</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || noMatch || !form.password || !form.confirm}
            style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
            {loading ? <><div className="spinner" />Resetting...</> : <><Lock size={16} />Reset Password</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
