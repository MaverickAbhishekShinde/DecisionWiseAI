import React from 'react';
import { PROJECTS, DECISIONS } from '../data/mockData';
import { FolderKanban, Users, Layers, ArrowRight, Calendar, ShieldCheck, Database } from 'lucide-react';

interface ProjectsPageProps {
  onSelectProject: (projectId: string) => void;
  onSelectDecision: (decisionId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject,
  onSelectDecision
}) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Engineering Projects
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          Explore organizational decision histories, team discussions, and architectural evolutions grouped by engineering domains.
        </p>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((project) => {
          const projectDecisions = DECISIONS.filter((d) => d.project_id === project.id);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header line */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Domain
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Team: {project.team}
                  </p>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.map((t) => (
                    <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Decisions</span>
                    <span className="font-extrabold text-slate-900">{project.associatedDecisionsCount} Reconstructed</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Evidence Sources</span>
                    <span className="font-extrabold text-slate-900">{project.evidenceSourcesCount} Linked</span>
                  </div>
                </div>
              </div>

              {/* Footer: Lead avatar & open link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={project.lead.avatar}
                    alt={project.lead.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-[11px]">{project.lead.name}</span>
                    <span className="text-[9px] text-slate-400">Tech Lead</span>
                  </div>
                </div>

                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-xs">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

