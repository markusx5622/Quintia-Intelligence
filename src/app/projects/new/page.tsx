import ProjectForm from '@/src/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="q-animate-in">
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#06b6d4',
          }}
        >
          New Analysis
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: '#f1f5f9',
            letterSpacing: '-0.01em',
          }}
        >
          Create Project
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b', maxWidth: 480 }}>
          Define your operational process narrative. Quintia will extract the process model,
          run diagnostics, and generate deterministic financial projections.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
