import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Zap, Download, Shield, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const features = [
    { icon: Zap, title: 'AI-Powered Generation', desc: 'Generate professional resumes and blogs in seconds using GPT-4 or Gemini AI.' },
    { icon: FileText, title: 'Rich Text Editor', desc: 'Edit your generated content with a full-featured WYSIWYG editor.' },
    { icon: Download, title: 'Export as PDF', desc: 'Download your documents as perfectly formatted PDFs instantly.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and stored securely with JWT authentication.' },
  ];

  const plans = [
    { name: 'Free', price: '$0', limit: '10 generations/month', features: ['Resume Builder', 'Blog Generator', 'PDF Export', 'Document History'] },
    { name: 'Pro', price: '$9', limit: '100 generations/month', features: ['Everything in Free', 'AI Suggestions', 'Multiple Templates', 'Priority Support'], popular: true },
    { name: 'Enterprise', price: '$29', limit: '1000 generations/month', features: ['Everything in Pro', 'Team Collaboration', 'Custom Templates', 'API Access'] },
  ];

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.03em' }}>AI<span style={{ color: 'var(--accent)' }}>Studio</span></span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>Sign In</Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>Get Started</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px clamp(40px, 8vw, 80px)', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(108,99,255,0.1)', border: '1px solid var(--border-strong)', borderRadius: '20px', padding: '6px 16px', marginBottom: '28px', fontSize: '12px', color: 'var(--accent-light)', fontWeight: '600' }}>
          <Sparkles size={13} /> Powered by GPT-4 & Gemini AI
        </div>
        <h1 className="fade-in" style={{ fontSize: 'clamp(32px, 7vw, 72px)', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '20px' }}>
          Create{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stunning</span>
          {' '}Resumes & Blogs with AI
        </h1>
        <p className="fade-in fade-in-delay-1" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 36px' }}>
          Generate, edit, and export professional resumes and blog posts in minutes. Save hours of work with artificial intelligence.
        </p>
        <div className="fade-in fade-in-delay-2" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 'clamp(14px, 2vw, 16px)', padding: 'clamp(10px, 2vw, 14px) clamp(18px, 3vw, 28px)' }}>
            <Sparkles size={16} /> Start for Free <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: 'clamp(14px, 2vw, 16px)', padding: 'clamp(10px, 2vw, 14px) clamp(18px, 3vw, 28px)' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '12px', letterSpacing: '-0.03em' }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'clamp(32px, 6vw, 56px)', fontSize: 'clamp(14px, 2vw, 16px)' }}>A complete platform for AI-powered content creation</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className={`card fade-in fade-in-delay-${i + 1}`}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(108,99,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '12px', letterSpacing: '-0.03em' }}>Simple Pricing</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'clamp(32px, 6vw, 56px)', fontSize: 'clamp(14px, 2vw, 16px)' }}>Start free, upgrade when you need more</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {plans.map(({ name, price, limit, features, popular }) => (
            <div key={name} className="card" style={{ border: popular ? '1px solid var(--accent)' : '1px solid var(--border)', boxShadow: popular ? '0 0 40px var(--accent-glow)' : 'none', position: 'relative' }}>
              {popular && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>POPULAR</div>
              )}
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{name}</h3>
              <div style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '4px' }}>
                {price}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '400' }}>/mo</span>
              </div>
              <p style={{ color: 'var(--accent-light)', fontSize: '12px', marginBottom: '18px' }}>{limit}</p>
              <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <Check size={13} color="var(--accent-green)" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-muted)', fontSize: '12px', borderTop: '1px solid var(--border)' }}>
        <p>© {new Date().getFullYear()} AIStudio. Built with MERN Stack + OpenAI/Gemini.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
