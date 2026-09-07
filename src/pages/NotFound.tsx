import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
        <Link to="/" className="text-primary hover:underline">Back to competitions</Link>
      </div>
    </div>
  );
}
