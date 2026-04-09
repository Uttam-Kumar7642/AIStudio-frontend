import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, BookOpen, Star, Trash2, Download, Edit, Plus, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { documentsAPI } from '../utils/api';

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deleting, setDeleting] = useState(null);

  const fetchDocs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (filter === 'resume' || filter === 'blog') params.type = filter;
      if (filter === 'favorite') params.favorite = true;
      const { data } = await documentsAPI.getAll(params);
      setDocs(data.documents); setPagination(data.pagination);
    } catch { toast.error('Failed to load documents.'); }
    finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => { const t = setTimeout(() => fetchDocs(1), 300); return () => clearTimeout(t); }, [fetchDocs]);

  const handleDelete = async (docId, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeleting(docId);
    try {
      await documentsAPI.delete(docId);
      setDocs(p => p.filter(d => d._id !== docId));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
    finally { setDeleting(null); }
  };

  const handleExportPDF = async (docId, title) => {
    try {
      toast.loading('Preparing PDF...', { id: `pdf-${docId}` });
      const res = await documentsAPI.exportPDF(docId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Downloaded!', { id: `pdf-${docId}` });
    } catch { toast.error('Export failed.', { id: `pdf-${docId}` }); }
  };

  const handleToggleFavorite = async (doc) => {
    try {
      await documentsAPI.update(doc._id, { isFavorite: !doc.isFavorite });
      setDocs(p => p.map(d => d._id === doc._id ? { ...d, isFavorite: !d.isFavorite } : d));
    } catch { toast.error('Failed to update.'); }
  };

  const filters = [
    { key: 'all', label: 'All', icon: FileText },
    { key: 'resume', label: 'Resumes', icon: Briefcase },
    { key: 'blog', label: 'Blogs', icon: BookOpen },
    { key: 'favorite', label: 'Starred', icon: Star },
  ];

  return (
    <div className="container" style={{ paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(16px, 3vw, 28px)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', letterSpacing: '-0.03em' }}>My Documents</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '3px' }}>{pagination.total} document{pagination.total !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/generate')} style={{ fontSize: '13px', padding: '9px 16px' }}>
          <Plus size={15} /> New Document
        </button>
      </div>

      {/* Search + Filters */}
      <div className="fade-in fade-in-delay-1" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '180px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {filters.map(({ key, label, icon: Icon }) => (
            <button key={key} className="btn" onClick={() => setFilter(key)}
              style={{ background: filter === key ? 'var(--accent)' : 'var(--bg-input)', color: filter === key ? 'white' : 'var(--text-secondary)', border: filter === key ? '1px solid var(--accent)' : '1px solid var(--border)', fontSize: '12px', padding: '7px 12px', boxShadow: filter === key ? '0 0 12px var(--accent-glow)' : 'none' }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ height: '140px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s ease infinite' }} />)}
        </div>
      ) : docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 80px) 20px' }}>
          <FileText size={40} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{search || filter !== 'all' ? 'No results found' : 'No documents yet'}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '13px' }}>{search || filter !== 'all' ? 'Try a different search.' : 'Generate your first AI document.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/generate')}><Plus size={15} /> Generate Document</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {docs.map((doc, idx) => (
              <div key={doc._id} className={`card fade-in fade-in-delay-${Math.min(idx + 1, 3)}`}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px', padding: 'clamp(14px, 2vw, 22px)' }}
                onClick={() => navigate(`/editor/${doc._id}`)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', flexShrink: 0, background: doc.type === 'resume' ? 'rgba(108,99,255,0.15)' : 'rgba(67,217,162,0.12)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {doc.type === 'resume' ? <Briefcase size={14} color="var(--accent)" /> : <BookOpen size={14} color="var(--accent-green)" />}
                    </div>
                    <span className={`badge badge-${doc.type}`}>{doc.type}</span>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: '3px', flexShrink: 0 }}
                    onClick={e => { e.stopPropagation(); handleToggleFavorite(doc); }}>
                    <Star size={15} fill={doc.isFavorite ? 'var(--accent-yellow)' : 'none'} color={doc.isFavorite ? 'var(--accent-yellow)' : 'var(--text-muted)'} />
                  </button>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }}>{doc.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} />{format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={e => { e.stopPropagation(); navigate(`/editor/${doc._id}`); }}><Edit size={13} /></button>
                    <button className="btn btn-ghost" style={{ padding: '5px' }} onClick={e => { e.stopPropagation(); handleExportPDF(doc._id, doc.title); }}><Download size={13} /></button>
                    <button className="btn btn-ghost" style={{ padding: '5px', color: 'var(--accent-secondary)' }}
                      onClick={e => { e.stopPropagation(); handleDelete(doc._id, doc.title); }}
                      disabled={deleting === doc._id}>
                      {deleting === doc._id ? <div className="spinner" style={{ width: '13px', height: '13px' }} /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '28px', flexWrap: 'wrap' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} className="btn" onClick={() => fetchDocs(p)}
                  style={{ padding: '7px 13px', background: p === pagination.page ? 'var(--accent)' : 'var(--bg-input)', color: p === pagination.page ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: '13px' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};

export default DocumentsPage;
