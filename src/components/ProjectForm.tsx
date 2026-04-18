'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [narrative, setNarrative] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const narrativeLength = narrative.trim().length;
  const isNarrativeShort = narrativeLength > 0 && narrativeLength < 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, narrative }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const { jobId } = await res.json();
      router.push(`/pipeline/${jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 680 }} className="q-animate-in">
      {error && (
        <div className="q-error-banner" role="alert" style={{ marginBottom: 20 }}>
          ⚠ {error}
        </div>
      )}

      <div className="q-card" style={{ marginBottom: 24 }}>
        <div className="q-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label htmlFor="name" className="q-form-label">
              Project Name <span className="q-form-required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Procurement Approval Process"
              className="q-input"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="description" className="q-form-label">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the process being analyzed"
              className="q-input"
            />
            <div style={{ fontSize: 11, color: 'var(--q-slate-500)', marginTop: 6 }}>
              Optional — helps identify this project later.
            </div>
          </div>

          <div>
            <label htmlFor="narrative" className="q-form-label">
              Process Narrative <span className="q-form-required">*</span>
            </label>
            <textarea
              id="narrative"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              required
              rows={12}
              placeholder="Describe your operational process in detail. Include roles involved, systems used, process steps, handoffs between teams, decision points, pain points, and any known bottlenecks..."
              className="q-textarea"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <div style={{ fontSize: 11, color: 'var(--q-slate-500)', lineHeight: 1.5 }}>
                Provide detailed narratives for richer analysis. Include roles, systems, steps, and pain points.
              </div>
              {narrativeLength > 0 && (
                <span style={{
                  fontSize: 11,
                  fontFamily: 'var(--q-font-mono)',
                  color: isNarrativeShort ? 'var(--q-warning-400)' : 'var(--q-slate-500)',
                  flexShrink: 0,
                  marginLeft: 12,
                }}>
                  {narrativeLength} chars
                </span>
              )}
            </div>
            {isNarrativeShort && (
              <div style={{ fontSize: 11, color: 'var(--q-warning-400)', marginTop: 4 }}>
                Short narratives produce limited analysis. Consider adding more process detail.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="submit"
          disabled={loading}
          className="q-btn q-btn-primary"
          style={{ minWidth: 200 }}
        >
          {loading ? (
            <>
              <span className="q-loading-spinner" style={{ width: 14, height: 14, borderWidth: '1.5px' }} />
              Creating Analysis...
            </>
          ) : (
            'Create & Analyze'
          )}
        </button>
        {!loading && (
          <span style={{ fontSize: 12, color: 'var(--q-slate-500)' }}>
            Pipeline will begin automatically after creation
          </span>
        )}
      </div>
    </form>
  );
}
