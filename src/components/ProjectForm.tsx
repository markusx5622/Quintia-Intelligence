'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(15,23,42,0.6)',
  border: '1px solid rgba(51,65,85,0.4)',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#e2e8f0',
  boxSizing: 'border-box',
  transition: 'border-color 200ms, box-shadow 200ms',
  outline: 'none',
};

const focusRing = {
  borderColor: 'rgba(6,182,212,0.5)',
  boxShadow: '0 0 0 3px rgba(6,182,212,0.1)',
};

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
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(220,38,38,0.08)',
            color: '#fca5a5',
            borderRadius: 8,
            marginBottom: 20,
            border: '1px solid rgba(220,38,38,0.2)',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="name"
          style={{
            display: 'block',
            fontWeight: 600,
            marginBottom: 8,
            color: '#cbd5e1',
            fontSize: 13,
          }}
        >
          Project Name <span style={{ color: '#06b6d4' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Procurement Approval Process"
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label
          htmlFor="description"
          style={{
            display: 'block',
            fontWeight: 600,
            marginBottom: 8,
            color: '#cbd5e1',
            fontSize: 13,
          }}
        >
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional short description"
          style={inputStyle}
          onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label
          htmlFor="narrative"
          style={{
            display: 'block',
            fontWeight: 600,
            marginBottom: 8,
            color: '#cbd5e1',
            fontSize: 13,
          }}
        >
          Process Narrative <span style={{ color: '#06b6d4' }}>*</span>
        </label>
        <textarea
          id="narrative"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          required
          rows={12}
          placeholder="Describe your operational process in detail. Include roles, systems, steps, handoffs, pain points..."
          style={{
            ...inputStyle,
            resize: 'vertical',
            lineHeight: 1.6,
          }}
          onFocus={(e) => Object.assign(e.currentTarget.style, focusRing)}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 28px',
          background: loading
            ? 'rgba(51,65,85,0.5)'
            : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity 150ms, transform 150ms',
          boxShadow: loading ? 'none' : '0 0 20px rgba(6, 182, 212, 0.15)',
          letterSpacing: '0.02em',
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'q-spin 0.8s linear infinite',
                display: 'inline-block',
              }}
            />
            Creating…
          </>
        ) : (
          'Create Project & Analyse'
        )}
      </button>
    </form>
  );
}
