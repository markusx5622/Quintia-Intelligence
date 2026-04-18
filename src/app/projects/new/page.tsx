import Link from 'next/link';
import ProjectForm from '@/src/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="q-page-content-enter">
      <div className="q-breadcrumb">
        <Link href="/projects">Projects</Link>
        <span className="q-breadcrumb-sep" />
        <span>New Analysis</span>
      </div>
      <div className="q-page-header" style={{ marginBottom: 32 }}>
        <div className="q-page-header-left">
          <h1 className="q-page-title">New Analysis</h1>
          <span className="q-page-subtitle">Submit a process narrative to generate structured intelligence</span>
        </div>
      </div>
      <ProjectForm />
    </div>
  );
}
