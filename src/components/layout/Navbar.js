import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { LayoutDashboard, FileText, Zap, LogOut, Menu, X, ChevronDown, Sparkles, Briefcase, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Generate', icon: Zap, path: '/generate' },
    { label: 'My Docs', icon: FileText, path: '/documents' },
  ];

  // Close menus on route change
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname.startsWith(path);
  const generationPct = Math.min(100, ((user?.generationsUsed || 0) / (user?.generationsLimit || 10)) * 100);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px var(--accent-glow)', flexShrink: 0 }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              AI<span style={{ color: 'var(--accent)' }}>Studio</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {navItems.map(({ label, icon: Icon, path }) => (
              <Link key={path} to={path} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px',
                borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: '600',
                color: isActive(path) ? 'var(--accent-light)' : 'var(--text-secondary)',
                background: isActive(path) ? 'rgba(108,99,255,0.12)' : 'transparent',
                textDecoration: 'none', transition: 'all var(--transition)',
              }}>
                <Icon size={15} />{label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* User Menu — desktop */}
            <div ref={userMenuRef} style={{ position: 'relative' }} className="hide-mobile">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 12px', cursor: 'pointer', transition: 'all var(--transition)' }}>
                <div style={{ width: '26px', height: '26px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} color="var(--text-muted)" style={{ transition: 'transform var(--transition)', transform: userMenuOpen ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
              </button>

              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px', minWidth: '210px', boxShadow: 'var(--shadow)', zIndex: 200 }}>
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>{user?.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    <span className={`badge badge-${user?.plan}`} style={{ marginTop: '6px' }}>{user?.plan}</span>
                  </div>
                  <div style={{ padding: '6px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>AI Generations</p>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${generationPct}%`, background: generationPct > 80 ? 'var(--accent-secondary)' : 'var(--accent)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{user?.generationsUsed || 0} / {user?.generationsLimit || 10} used</p>
                  </div>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', transition: 'all var(--transition)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--accent-secondary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile: Avatar + Hamburger */}
            <div className="show-mobile" style={{ alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: 'white' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button ref={menuRef} onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: '280px', zIndex: 200,
        background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '14px' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        {/* Plan + Usage */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Generations</span>
            <span className={`badge badge-${user?.plan}`}>{user?.plan}</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${generationPct}%`, background: generationPct > 80 ? 'var(--accent-secondary)' : 'var(--accent)', borderRadius: '3px' }} />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>{user?.generationsUsed || 0} / {user?.generationsLimit || 10} used</p>
        </div>

        {/* Nav Links */}
        <div style={{ padding: '12px', flex: 1 }}>
          {navItems.map(({ label, icon: Icon, path }) => (
            <Link key={path} to={path} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
              borderRadius: 'var(--radius)', fontSize: '15px', fontWeight: '600',
              color: isActive(path) ? 'var(--accent-light)' : 'var(--text-secondary)',
              background: isActive(path) ? 'rgba(108,99,255,0.12)' : 'transparent',
              textDecoration: 'none', marginBottom: '4px', transition: 'all var(--transition)',
            }}>
              <Icon size={18} />{label}
            </Link>
          ))}

          {/* Quick Generate */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', padding: '0 14px' }}>Quick Generate</p>
            <Link to="/generate/resume" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '4px' }}>
              <Briefcase size={16} color="var(--accent)" /> Resume
            </Link>
            <Link to="/generate/blog" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <BookOpen size={16} color="var(--accent-green)" /> Blog Post
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', background: 'rgba(255,101,132,0.08)', border: '1px solid rgba(255,101,132,0.2)', borderRadius: 'var(--radius)', padding: '12px 16px', cursor: 'pointer', color: 'var(--accent-secondary)', fontSize: '14px', fontWeight: '600' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
