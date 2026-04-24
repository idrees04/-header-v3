import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/AppLayout';
import { FileText } from 'lucide-react';

export const Route = createFileRoute('/$')({
  component: CatchAllPage,
});

function CatchAllPage() {
  const { _splat } = Route.useParams();
  const segments = _splat?.split('/').filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1] ?? 'Page';
  const pageTitle = lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">/{_splat}</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">This page is under construction.</p>
        </div>
      </div>
    </AppLayout>
  );
}
