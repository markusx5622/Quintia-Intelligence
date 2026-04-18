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
    <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
      {error && (
        <div className="q-error-banner" style={{ marginBottom: 20 }}>
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
              placeholder="Optional short description"
              className="q-input"
            />
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
              rows={10}
              placeholder="Describe your operational process in detail. Include roles, systems, steps, handoffs, pain points..."
              className="q-textarea"
            />
            <div style={{ fontSize: 12, color: 'var(--q-slate-400)', marginTop: 6 }}>
              The more detail you provide, the richer the analysis output.
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="q-btn q-btn-primary"
      >
        {loading ? 'Creating...' : '⚡ Create Project & Analyse'}
      </button>
    </form>
  );
}
