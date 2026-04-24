import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '@/components/AppLayout';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome! Use the sidebar to navigate through your available modules.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Quick Access', desc: 'Navigate via sidebar menus' },
            { title: 'Role-Based', desc: 'Menus adapt to your roles' },
            { title: 'Dynamic URLs', desc: 'Params auto-resolved' },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-card-foreground">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
