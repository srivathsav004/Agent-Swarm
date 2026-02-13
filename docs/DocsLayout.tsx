import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Button } from '../demo/components/ui/button';
import {
  BookOpen,
  Settings2,
  Boxes,
  Film,
  Workflow,
  PlugZap,
  Network,
  HelpCircle,
  Cpu,
} from 'lucide-react';

const navItems = [
  { to: '/docs/introduction', label: 'Introduction', icon: BookOpen },
  { to: '/docs/prerequisites', label: 'Prerequisites', icon: Settings2 },
  { to: '/docs/architecture', label: 'Smart Contract Architecture', icon: Boxes },
  { to: '/docs/demo', label: 'Live Demo', icon: Film },
  { to: '/docs/workflow', label: 'User Workflow', icon: Workflow },
  { to: '/docs/integration', label: 'Integration Guide', icon: PlugZap },
  { to: '/docs/network', label: 'Network Details', icon: Network },
  { to: '/docs/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/docs/deep-dive', label: 'Technical Deep Dive', icon: Cpu },
];

const DocsLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050509] text-zinc-100 selection:bg-[#00FF94] selection:text-[#050509]">
      {/* Top header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-agent-swarm.svg"
                alt="AgentSwarm"
                className="h-8 w-8 rounded-sm"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-[0.25em] text-zinc-400">
                  DOCS
                </span>
                <span className="text-xl font-bold tracking-tight text-zinc-50">
                  AgentSwarm
                </span>
              </div>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 md:flex">
            <NavLink
              to="/docs/introduction"
              className={({ isActive }) =>
                isActive ? 'text-zinc-100' : 'hover:text-zinc-100'
              }
            >
              Intro
            </NavLink>
            <NavLink
              to="/docs/architecture"
              className={({ isActive }) =>
                isActive ? 'text-zinc-100' : 'hover:text-zinc-100'
              }
            >
              Architecture
            </NavLink>
            <NavLink
              to="/docs/demo"
              className={({ isActive }) =>
                isActive ? 'text-zinc-100' : 'hover:text-zinc-100'
              }
            >
              Demo
            </NavLink>
            <NavLink
              to="/docs/workflow"
              className={({ isActive }) =>
                isActive ? 'text-zinc-100' : 'hover:text-zinc-100'
              }
            >
              Workflow
            </NavLink>
            <NavLink
              to="/docs/integration"
              className={({ isActive }) =>
                isActive ? 'text-zinc-100' : 'hover:text-zinc-100'
              }
            >
              API Reference
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/demo">
              <Button
                variant="default"
                className="bg-[#FF6B35] text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-[#ff8459]"
              >
                Launch Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto flex max-w-6xl gap-8 px-4 py-8 lg:py-10">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-zinc-900 pr-4 lg:block">
          <div className="sticky top-24 space-y-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Documentation
            </div>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      'flex items-center rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-zinc-900 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
                    ].join(' ')
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Section content */}
        <section className="flex-1 pb-16">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DocsLayout;

