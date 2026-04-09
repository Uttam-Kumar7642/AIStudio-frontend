import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Zap, Plus, Star, Clock, Briefcase, BookOpen, Download, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../store/AuthContext';
import { documentsAPI } from '../utils/api';

const StatCard = ({ icon: Icon, label, value, color = 'var(--accent)' }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
    <div style={{ width: '42px', height: '42px', flexShrink: 0, background: `${color}20`, borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={19} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '3px' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, statsRes] = await Promise.all([documentsAPI.getAll({ limit: 5 }), documentsAPI.getStats()]);
        setRecentDocs(docsRes.data.documents);
        setStats(statsRes.data);
      } catch { toast.error('Failed to load dashboard.'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleExportPDF = async (docId, title) => {
    try {
      const res = await documentsAPI.exportPDF(docId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch { toast.error('Export failed.'); }
  };

  const generationPct = Math.min(100, ((user?.generationsUsed || 0) / (user?.generationsLimit || 10)) * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  const statsCards = [
    { icon: FileText, label: 'Total Documents', value: stats?.total ?? '—', color: 'var(--accent)' },
    { icon: Briefcase, label: 'Resumes', value: stats?.stats?.find(s => s._id === 'resume')?.count ?? 0, color: 'var(--accent-light)' },
    { icon: BookOpen, label: 'Blog Posts', value: stats?.stats?.find(s => s._id === 'blog')?.count ?? 0, color: 'var(--accent-green)' },
    { icon: Star, label: 'Favourites', value: stats?.favorites ?? 0, color: 'var(--accent-yellow)' },
  ];

  return (
    <div className="container" style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: '60px' }}>
      {/* Greeting */}
      <div className="fade-in" style={{ marginBottom: 'clamp(20px, 4vw, 36px)' }}>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
          Good {greeting}, <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: 'clamp(20px, 4vw, 32px)' }}>
        {statsCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 320px)', gap: '20px' }} className="dashboard-grid">

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          {/* Quick Generate */}
          <div className="card fade-in fade-in-delay-1">
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Quick Generate</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { type: 'resume', icon: Briefcase, label: 'Resume', desc: 'AI-crafted resume', color: 'var(--accent)', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)' },
                { type: 'blog', icon: BookOpen, label: 'Blog Post', desc: 'SEO-optimized article', color: 'var(--accent-green)', bg: 'rgba(67,217,162,0.08)', border: 'rgba(67,217,162,0.2)' },
              ].map(({ type, icon: Icon, label, desc, color, bg, border }) => (
                <button key={type} onClick={() => navigate(`/generate/${type}`)}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius)', padding: 'clamp(14px, 2vw, 20px)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ width: '36px', height: '36px', background: `${color}25`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={color} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>{label}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Docs */}
          <div className="card fade-in fade-in-delay-2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Recent Documents</h2>
              <Link to="/documents" className="btn btn-ghost" style={{ fontSize: '12px', color: 'var(--accent-light)', padding: '4px 8px' }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[1,2,3].map(i => <div key={i} style={{ height: '52px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s ease infinite' }} />)}
              </div>
            ) : recentDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <FileText size={28} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '14px' }}>No documents yet.</p>
                <Link to="/generate" className="btn btn-primary" style={{ fontSize: '13px' }}><Zap size={14} /> Generate Now</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recentDocs.map(doc => (
                  <div key={doc._id}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', cursor: 'pointer', transition: 'all var(--transition)', border: '1px solid transparent' }}
                    onClick={() => navigate(`/editor/${doc._id}`)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--bg-input)'; }}>
                    <div style={{ width: '32px', height: '32px', flexShrink: 0, background: doc.type === 'resume' ? 'rgba(108,99,255,0.15)' : 'rgba(67,217,162,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {doc.type === 'resume' ? <Briefcase size={14} color="var(--accent)" /> : <BookOpen size={14} color="var(--accent-green)" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: '600', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{format(new Date(doc.updatedAt), 'MMM d, yyyy')}</p>
                    </div>
                    <span className={`badge badge-${doc.type}`} style={{ flexShrink: 0 }}>{doc.type}</span>
                    <button className="btn btn-ghost" style={{ padding: '5px', flexShrink: 0 }}
                      onClick={e => { e.stopPropagation(); handleExportPDF(doc._id, doc.title); }} title="Export PDF">
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Usage */}
          <div className="card fade-in fade-in-delay-1">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14px' }}>AI Usage</h3>
              <span className={`badge badge-${user?.plan}`}>{user?.plan}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Generations</span>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>{user?.generationsUsed || 0} / {user?.generationsLimit || 10}</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ height: '100%', width: `${generationPct}%`, background: generationPct > 80 ? 'var(--accent-secondary)' : generationPct > 50 ? 'var(--accent-yellow)' : 'var(--accent)', borderRadius: '4px', transition: 'width 0.6s ease' }} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{(user?.generationsLimit || 10) - (user?.generationsUsed || 0)} remaining</p>
            {generationPct > 70 && (
              <div style={{ background: 'rgba(246,201,14,0.1)', border: '1px solid rgba(246,201,14,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: '12px', color: 'var(--accent-yellow)', marginTop: '12px', lineHeight: '1.5' }}>
                ⚡ Running low — upgrade to Pro for 100 generations/month.
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card fade-in fade-in-delay-2">
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>💡 Pro Tips</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {['Be specific in prompts for better results', 'Edit AI output to personalize it', 'Export to PDF for professional sharing', 'Star important docs to find them fast'].map(tip => (
                <li key={tip} style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '14px', position: 'relative', lineHeight: '1.5' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>›</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
