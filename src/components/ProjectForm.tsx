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
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: 6, marginBottom: 16, border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#1e293b' }}>
          Project Name <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Procurement Approval Process"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="description" style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#1e293b' }}>
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional short description"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="narrative" style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#1e293b' }}>
          Process Narrative <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <textarea
          id="narrative"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          required
          rows={10}
          placeholder="Describe your operational process in detail. Include roles, systems, steps, handoffs, pain points..."
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 24px',
          background: loading ? '#94a3b8' : '#1e40af',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Creating...' : 'Create Project & Analyse'}
      </button>
    </form>
  );
}
