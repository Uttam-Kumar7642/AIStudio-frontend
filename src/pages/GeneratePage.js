import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, Briefcase, BookOpen, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '../utils/api';
import { useAuth } from '../store/AuthContext';

const TypeSelector = ({ onSelect }) => (
  <div className="container" style={{ paddingTop: 'clamp(40px, 8vw, 60px)', paddingBottom: '60px' }}>
    <div className="fade-in" style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
      <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '-0.03em', marginBottom: '10px' }}>What would you like to create?</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(13px, 2vw, 16px)' }}>Choose a content type to get started</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
      {[
        { type: 'resume', icon: Briefcase, title: 'Resume', desc: 'Generate a professional, ATS-optimized resume tailored to your target role.', color: 'var(--accent)', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)' },
        { type: 'blog', icon: BookOpen, title: 'Blog Post', desc: 'Create an engaging, SEO-optimized blog article on any topic.', color: 'var(--accent-green)', bg: 'rgba(67,217,162,0.08)', border: 'rgba(67,217,162,0.25)' },
      ].map(({ type, icon: Icon, title, desc, color, bg, border }) => (
        <button key={type} onClick={() => onSelect(type)}
          style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-lg)', padding: 'clamp(20px, 4vw, 28px)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all var(--transition)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${border}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
          <div style={{ width: '48px', height: '48px', background: `${color}25`, borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} color={color} />
          </div>
          <div>
            <h3 style={{ fontSize: '19px', marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6' }}>{desc}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color, fontSize: '13px', fontWeight: '700' }}>
            Generate {title} <ChevronRight size={14} />
          </div>
        </button>
      ))}
    </div>
  </div>
);

const FieldGroup = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div><label className="label">{label}</label>{children}</div>
);

const ResumeForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ name: '', jobTitle: '', industry: 'Technology', experienceLevel: 'Mid-level', experience: '', skills: '', education: '', achievements: '', language: 'English' });
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <FieldGroup>
        <Field label="Full Name *"><input className="input" placeholder="Jane Smith" value={form.name} onChange={set('name')} required /></Field>
        <Field label="Target Job Title *"><input className="input" placeholder="Senior Software Engineer" value={form.jobTitle} onChange={set('jobTitle')} required /></Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Industry">
          <select className="input" value={form.industry} onChange={set('industry')} style={{ cursor: 'pointer' }}>
            {['Technology','Finance','Healthcare','Marketing','Design','Education','Sales','Other'].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Experience Level">
          <select className="input" value={form.experienceLevel} onChange={set('experienceLevel')} style={{ cursor: 'pointer' }}>
            {['Entry-level','Mid-level','Senior','Lead','Executive'].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
      </FieldGroup>
      <Field label="Work Experience *"><textarea className="input textarea" rows={4} placeholder="Describe your work experience, roles, companies, and duration..." value={form.experience} onChange={set('experience')} required /></Field>
      <Field label="Skills *"><textarea className="input textarea" rows={3} placeholder="React, Node.js, Python, AWS, Team Leadership, Agile..." value={form.skills} onChange={set('skills')} required /></Field>
      <Field label="Education"><textarea className="input textarea" rows={2} placeholder="B.S. Computer Science, MIT, 2020..." value={form.education} onChange={set('education')} /></Field>
      <Field label="Key Achievements"><textarea className="input textarea" rows={3} placeholder="Quantified achievements, e.g. Increased productivity by 40%..." value={form.achievements} onChange={set('achievements')} /></Field>
      <Field label="Language">
        <select className="input" value={form.language} onChange={set('language')} style={{ cursor: 'pointer', maxWidth: '200px' }}>
          {['English','Spanish','French','German','Portuguese','Hindi'].map(v => <option key={v}>{v}</option>)}
        </select>
      </Field>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '13px 24px', fontSize: '15px', alignSelf: 'flex-start' }}>
        {loading ? <><div className="spinner" />Generating...</> : <><Zap size={16} />Generate Resume</>}
      </button>
    </form>
  );
};

const BlogForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ topic: '', tone: 'professional', audience: 'General public', wordCount: '800', keywords: '', outline: '', language: 'English' });
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ ...form, wordCount: Number(form.wordCount) }); }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <Field label="Blog Topic *"><input className="input" placeholder="e.g. The Future of AI in Healthcare..." value={form.topic} onChange={set('topic')} required /></Field>
      <FieldGroup>
        <Field label="Tone">
          <select className="input" value={form.tone} onChange={set('tone')} style={{ cursor: 'pointer' }}>
            {['professional','casual','technical','inspirational','humorous','educational'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Target Audience">
          <select className="input" value={form.audience} onChange={set('audience')} style={{ cursor: 'pointer' }}>
            {['General public','Developers','Business professionals','Students','Executives','Beginners'].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Word Count">
          <select className="input" value={form.wordCount} onChange={set('wordCount')} style={{ cursor: 'pointer' }}>
            {['400','600','800','1000','1500','2000'].map(v => <option key={v} value={v}>{v} words</option>)}
          </select>
        </Field>
      </FieldGroup>
      <Field label="SEO Keywords"><input className="input" placeholder="machine learning, AI tools (comma-separated)" value={form.keywords} onChange={set('keywords')} /></Field>
      <Field label="Custom Outline (Optional)"><textarea className="input textarea" rows={4} placeholder="1. Introduction&#10;2. Main Points&#10;3. Conclusion" value={form.outline} onChange={set('outline')} /></Field>
      <Field label="Language">
        <select className="input" value={form.language} onChange={set('language')} style={{ cursor: 'pointer', maxWidth: '200px' }}>
          {['English','Spanish','French','German','Portuguese','Hindi'].map(v => <option key={v}>{v}</option>)}
        </select>
      </Field>
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '13px 24px', fontSize: '15px', alignSelf: 'flex-start' }}>
        {loading ? <><div className="spinner" />Generating...</> : <><Zap size={16} />Generate Blog Post</>}
      </button>
    </form>
  );
};

const GeneratePage = () => {
  const { type: urlType } = useParams();
  const [selectedType, setSelectedType] = useState(urlType || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();

  const handleGenerate = async (formData) => {
    if (!selectedType) return;
    setLoading(true);
    try {
      toast.loading('AI is generating your content...', { id: 'gen' });
      const { data } = await aiAPI.generate(selectedType, formData);
      toast.success('Content generated!', { id: 'gen' });
      updateUser({ generationsUsed: (user?.generationsUsed || 0) + 1 });
      navigate(`/editor/${data.document.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed.', { id: 'gen' });
    } finally { setLoading(false); }
  };

  if (!selectedType) return <TypeSelector onSelect={setSelectedType} />;

  return (
    <div className="container" style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: '60px', maxWidth: '780px' }}>
      <div className="fade-in" style={{ marginBottom: '24px' }}>
        <button className="btn btn-ghost" onClick={() => setSelectedType(null)} style={{ marginBottom: '14px', padding: '6px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: selectedType === 'resume' ? 'rgba(108,99,255,0.15)' : 'rgba(67,217,162,0.12)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {selectedType === 'resume' ? <Briefcase size={18} color="var(--accent)" /> : <BookOpen size={18} color="var(--accent-green)" />}
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', letterSpacing: '-0.03em' }}>Generate {selectedType === 'resume' ? 'Resume' : 'Blog Post'}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Fill in the details below. AI will handle the rest.</p>
          </div>
        </div>
      </div>
      <div className="card fade-in fade-in-delay-1">
        {selectedType === 'resume' ? <ResumeForm onSubmit={handleGenerate} loading={loading} /> : <BlogForm onSubmit={handleGenerate} loading={loading} />}
      </div>
    </div>
  );
};

export default GeneratePage;
