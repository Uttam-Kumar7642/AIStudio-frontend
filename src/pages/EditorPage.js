import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Download, Star, StarOff, ArrowLeft, Sparkles, Loader, Edit3, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentsAPI, aiAPI } from '../utils/api';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'], ['clean'],
  ],
};

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const autosaveTimer = useRef(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const { data } = await documentsAPI.getById(id);
        setDoc(data.document); setContent(data.document.content); setTitle(data.document.title);
      } catch { toast.error('Document not found.'); navigate('/documents'); }
      finally { setLoading(false); }
    };
    fetchDoc();
  }, [id, navigate]);

  const saveDocument = useCallback(async (newContent, newTitle, showToast = false) => {
    if (!id) return;
    setSaving(true);
    try {
      await documentsAPI.update(id, { content: newContent, title: newTitle });
      setSaved(true);
      if (showToast) toast.success('Saved!');
    } catch { toast.error('Failed to save.'); }
    finally { setSaving(false); }
  }, [id]);

  const handleContentChange = (value) => {
    setContent(value); setSaved(false);
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => saveDocument(value, title), 3000);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value); setSaved(false);
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => saveDocument(content, e.target.value), 3000);
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true); setShowSuggestions(true);
    try {
      const { data } = await aiAPI.getSuggestions(content, doc?.type);
      setSuggestions(data.suggestions || []);
    } catch { toast.error('Failed to get suggestions.'); setShowSuggestions(false); }
    finally { setLoadingSuggestions(false); }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Preparing PDF...', { id: 'pdf' });
      const res = await documentsAPI.exportPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch { toast.error('Export failed.', { id: 'pdf' }); }
  };

  const handleToggleFavorite = async () => {
    try {
      await documentsAPI.update(id, { isFavorite: !doc.isFavorite });
      setDoc(p => ({ ...p, isFavorite: !p.isFavorite }));
      toast.success(doc.isFavorite ? 'Removed from favourites' : 'Added to favourites');
    } catch { toast.error('Failed to update.'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px' }}>
      <div className="spinner" style={{ width: '28px', height: '28px', borderWidth: '3px', borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      <span style={{ color: 'var(--text-muted)' }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', flexShrink: 0, minHeight: '52px' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/documents')} style={{ padding: '6px 8px', fontSize: '13px', gap: '4px' }}>
          <ArrowLeft size={15} /><span className="hide-mobile">Docs</span>
        </button>
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        {/* Title */}
        <div style={{ flex: 1, minWidth: '120px' }}>
          {editingTitle ? (
            <input className="input" value={title} onChange={handleTitleChange}
              onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
              autoFocus style={{ padding: '5px 10px', fontSize: '13px', fontWeight: '700' }} />
          ) : (
            <button onClick={() => setEditingTitle(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', fontFamily: 'var(--font)', maxWidth: '100%' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'clamp(100px, 20vw, 280px)' }}>{title}</span>
              <Edit3 size={12} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {/* Status */}
        <span style={{ fontSize: '11px', color: saving ? 'var(--accent-yellow)' : saved ? 'var(--accent-green)' : 'var(--text-muted)', flexShrink: 0 }}>
          {saving ? '● Saving' : saved ? '✓ Saved' : '○ Unsaved'}
        </span>

        {doc && <span className={`badge badge-${doc.type}`} style={{ flexShrink: 0 }}>{doc.type}</span>}

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        <button className="btn btn-ghost" onClick={handleToggleFavorite} style={{ padding: '7px', flexShrink: 0 }}>
          {doc?.isFavorite ? <Star size={15} fill="var(--accent-yellow)" color="var(--accent-yellow)" /> : <StarOff size={15} />}
        </button>
        <button className="btn btn-ghost" onClick={handleGetSuggestions} disabled={loadingSuggestions} style={{ padding: '6px 10px', fontSize: '12px', flexShrink: 0 }}>
          {loadingSuggestions ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={13} />}
          <span className="hide-mobile">AI Tips</span>
        </button>
        <button className="btn btn-secondary" onClick={() => saveDocument(content, title, true)} disabled={saving} style={{ padding: '6px 12px', fontSize: '12px', flexShrink: 0 }}>
          <Save size={13} /><span className="hide-mobile">Save</span>
        </button>
        <button className="btn btn-primary" onClick={handleExportPDF} style={{ padding: '6px 12px', fontSize: '12px', flexShrink: 0 }}>
          <Download size={13} /><span className="hide-mobile">PDF</span>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Editor */}
        <div style={{ flex: 1, overflow: 'hidden', padding: 'clamp(10px, 2vw, 20px)', display: 'flex', flexDirection: 'column' }}>
          <ReactQuill theme="snow" value={content} onChange={handleContentChange} modules={quillModules}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} />
        </div>

        {/* Suggestions Panel */}
        {showSuggestions && (
          <div style={{ width: 'clamp(240px, 30vw, 300px)', flexShrink: 0, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Sparkles size={15} color="var(--accent)" />
                <span style={{ fontWeight: '700', fontSize: '13px' }}>AI Suggestions</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowSuggestions(false)} style={{ padding: '4px' }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loadingSuggestions ? (
                [...Array(5)].map((_, i) => <div key={i} style={{ height: '52px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s ease infinite' }} />)
              ) : suggestions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No suggestions. Add more content first.</p>
              ) : suggestions.map((s, i) => (
                <div key={i} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', display: 'flex', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', flexShrink: 0, background: 'rgba(108,99,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: 'var(--accent)' }}>{i + 1}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s}</p>
                </div>
              ))}
            </div>
            {!loadingSuggestions && suggestions.length > 0 && (
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-secondary" onClick={handleGetSuggestions} style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>
                  <Sparkles size={13} /> Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} } .ql-editor { min-height: 200px; }`}</style>
    </div>
  );
};

export default EditorPage;
