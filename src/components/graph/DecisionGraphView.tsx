import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  GRAPH_NODES, 
  GRAPH_EDGES, 
  PROJECTS, 
  DECISIONS, 
  EVIDENCE_STORE, 
  CONTRIBUTORS 
} from '../../data/mockData';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  X, 
  ArrowRight,
  AlertCircle,
  Kanban,
  MessageSquare,
  FileText,
  GitPullRequest,
  Activity,
  TrendingUp,
  BrainCircuit,
  Search,
  CheckCircle2,
  Video
} from 'lucide-react';
import { SourceTypeBadge, VerificationBadge } from '../common/EvidenceBadge';

interface DecisionGraphViewProps {
  onSelectDecision: (decisionId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  initialProjectFilter?: string;
  highlightedDecisionId?: string;
}

export const DecisionGraphView: React.FC<DecisionGraphViewProps> = ({
  onSelectDecision,
  onSelectEvidence,
  initialProjectFilter = 'all',
  highlightedDecisionId
}) => {
  const [selectedProject, setSelectedProject] = useState<string>(initialProjectFilter);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Node type styling configurations
  const nodeStyles: Record<string, { bg: string; border: string; text: string; icon: any; label: string }> = {
    problem: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', icon: AlertCircle, label: 'Problem / Incident' },
    jira: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Kanban, label: 'Jira Issue' },
    discussion: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: MessageSquare, label: 'Discussion' },
    meeting: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Video, label: 'Meeting Transcript' },
    adr: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: FileText, label: 'ADR / RFC' },
    decision: { bg: 'bg-gradient-to-r from-indigo-600 to-indigo-700', border: 'border-indigo-800 ring-2 ring-indigo-400/50', text: 'text-white', icon: BrainCircuit, label: 'Decision Core' },
    pull_request: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: GitPullRequest, label: 'GitHub PR' },
    deployment: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', icon: Activity, label: 'Deployment' },
    outcome: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: TrendingUp, label: 'Observed Outcome' },
  };

  // Node positions mapped into a clean topological flow
  // 8 column flow: Problem -> Jira -> Discussion -> RFC -> Decision -> PR -> Deployment -> Outcome
  const columnX: Record<string, number> = {
    problem: 40,
    jira: 290,
    discussion: 540,
    meeting: 540,
    adr: 790,
    decision: 1040,
    pull_request: 1330,
    deployment: 1590,
    outcome: 1850
  };

  // Compute layout coordinates for nodes
  const layoutNodes = useMemo(() => {
    // Group nodes by column
    const colCounters: Record<string, number> = {};

    return GRAPH_NODES.map((node) => {
      const col = node.type === 'meeting' ? 'meeting' : node.type;
      const count = colCounters[col] || 0;
      colCounters[col] = count + 1;

      // Vertical spacing based on project flow
      let yOffset = 60 + count * 150;
      if (node.project === 'proj-payments' && node.id.includes('retry')) {
        yOffset = 420;
      } else if (node.project === 'proj-auth') {
        yOffset = 260 + (count % 2) * 110;
      } else if (node.project === 'proj-notify') {
        yOffset = 560;
      }

      const x = columnX[node.type] || 40;
      const y = yOffset;

      return {
        ...node,
        x,
        y,
        width: node.type === 'decision' ? 240 : 210,
        height: node.type === 'decision' ? 84 : 76
      };
    });
  }, []);

  // Filter nodes based on project and search
  const filteredNodes = useMemo(() => {
    return layoutNodes.filter((node) => {
      const matchProject = selectedProject === 'all' || node.project === selectedProject;
      const matchType = selectedType === 'all' || node.type === selectedType;
      const matchSearch = !searchQuery || 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.sub.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProject && matchType && matchSearch;
    });
  }, [layoutNodes, selectedProject, selectedType, searchQuery]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filter edges where both source and target are visible
  const filteredEdges = useMemo(() => {
    return GRAPH_EDGES.filter((edge) => {
      return activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target);
    });
  }, [activeNodeIds]);

  // Find connected nodes for highlight
  const connectedNodeIds = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    if (!targetId) return null;

    const connected = new Set<string>([targetId]);
    // 1-hop upstream and downstream
    GRAPH_EDGES.forEach((e) => {
      if (e.source === targetId) connected.add(e.target);
      if (e.target === targetId) connected.add(e.source);
    });
    return connected;
  }, [hoveredNodeId, selectedNodeId]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.graph-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(0.85);
    setPan({ x: 30, y: 50 });
  };

  const selectedNode = useMemo(() => {
    return layoutNodes.find(n => n.id === selectedNodeId) || null;
  }, [layoutNodes, selectedNodeId]);

  // Related decision jump helper
  const getDecisionForNode = (node: any) => {
    if (node.id.includes('dynamo') || node.id.includes('342') || node.id.includes('128') || node.id.includes('8821')) {
      return 'dec-pg-dynamo';
    }
    if (node.id.includes('auth') || node.id.includes('112') || node.id.includes('415') || node.id.includes('8910')) {
      return 'dec-auth-refactor';
    }
    if (node.id.includes('retry') || node.id.includes('580') || node.id.includes('9044') || node.id.includes('882')) {
      return 'dec-payment-retry-circuit';
    }
    if (node.id.includes('mono') || node.id.includes('042')) {
      return 'dec-microservices';
    }
    if (node.id.includes('notify') || node.id.includes('155')) {
      return 'dec-notification-arch';
    }
    return 'dec-pg-dynamo';
  };

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col select-none">
      {/* Graph Control & Filter Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        {/* Left: Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Project:</span>
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden hover:bg-slate-100 transition-colors"
          >
            <option value="all">All Projects (3)</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Node Type Filter */}
          <div className="hidden lg:flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'problem', label: 'Problems' },
              { id: 'decision', label: 'Decisions' },
              { id: 'adr', label: 'ADRs/RFCs' },
              { id: 'pull_request', label: 'PRs' },
              { id: 'deployment', label: 'Deployments' },
              { id: 'outcome', label: 'Outcomes' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                  selectedType === type.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter graph nodes..."
              className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400 w-44"
            />
          </div>

          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
              className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="px-2 text-[11px] font-mono text-slate-500 border-x border-slate-200">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
              className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition-colors"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]"
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            width: '2200px',
            height: '1100px',
            position: 'absolute'
          }}
        >
          {/* SVG Edges Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#4f46e5" />
              </marker>
            </defs>

            {filteredEdges.map((edge) => {
              const sourceNode = layoutNodes.find((n) => n.id === edge.source);
              const targetNode = layoutNodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isEdgeHighlighted =
                connectedNodeIds &&
                (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target));

              const x1 = sourceNode.x + sourceNode.width;
              const y1 = sourceNode.y + sourceNode.height / 2;
              const x2 = targetNode.x;
              const y2 = targetNode.y + targetNode.height / 2;

              // Smooth bezier curve
              const dx = Math.abs(x2 - x1) * 0.5;
              const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              // Midpoint for label
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={edge.id}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isEdgeHighlighted ? '#4f46e5' : '#cbd5e1'}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.5}
                    strokeDasharray={isEdgeHighlighted ? 'none' : 'none'}
                    markerEnd={isEdgeHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-colors duration-150"
                  />
                  {/* Edge Relationship Label */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-42}
                      y={-10}
                      width={84}
                      height={20}
                      rx={10}
                      fill={isEdgeHighlighted ? '#eef2ff' : '#ffffff'}
                      stroke={isEdgeHighlighted ? '#818cf8' : '#e2e8f0'}
                      strokeWidth={1}
                    />
                    <text
                      textAnchor="middle"
                      y={3.5}
                      className="text-[9px] font-semibold select-none"
                      fill={isEdgeHighlighted ? '#4338ca' : '#64748b'}
                    >
                      {edge.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes Layer */}
          {filteredNodes.map((node) => {
            const style = nodeStyles[node.type] || nodeStyles.problem;
            const Icon = style.icon;
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isConnected = connectedNodeIds ? connectedNodeIds.has(node.id) : true;
            const isDecisionCore = node.type === 'decision';

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.width}px`,
                  height: `${node.height}px`,
                }}
                className={`graph-node absolute rounded-2xl cursor-pointer p-3 border transition-all duration-150 shadow-sm flex flex-col justify-between ${
                  style.bg
                } ${style.border} ${
                  isSelected
                    ? 'ring-3 ring-indigo-500 shadow-lg scale-105 z-30'
                    : isHovered
                    ? 'scale-105 shadow-md z-20'
                    : 'z-10'
                } ${
                  connectedNodeIds && !isConnected
                    ? 'opacity-30 grayscale-[30%]'
                    : 'opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isDecisionCore ? 'text-indigo-200' : style.text}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${
                      isDecisionCore ? 'text-indigo-100' : 'text-slate-400'
                    }`}>
                      {node.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono shrink-0 ${
                    isDecisionCore ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    {node.date}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-tight truncate ${
                    isDecisionCore ? 'text-white text-sm' : 'text-slate-900'
                  }`}>
                    {node.label}
                  </h4>
                  <p className={`text-[11px] truncate mt-0.5 ${
                    isDecisionCore ? 'text-indigo-100' : 'text-slate-500'
                  }`}>
                    {node.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Overlay at bottom left */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-md text-xs space-y-2 select-none z-10 max-w-sm">
          <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Decision Graph Legend
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click node to inspect</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Problem / Incident</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Jira Issue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Discussion / Slack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>ADR / RFC Document</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-700 ring-2 ring-indigo-300"></span>
              <span className="font-bold text-indigo-900">Decision Core</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>GitHub Pull Request</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>CI/CD Deployment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <span>Observed Outcome</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details Side Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-5 flex flex-col justify-between z-20 animate-in slide-in-from-right-4 duration-150">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedNode.type.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedNode.sub}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recorded Date:</span>
                  <span className="font-semibold text-slate-800">{selectedNode.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Domain Project:</span>
                  <span className="font-semibold text-slate-800">
                    {PROJECTS.find(p => p.id === selectedNode.project)?.name || selectedNode.project}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-semibold text-emerald-600">96% (Verified)</span>
                </div>
              </div>

              {/* Connected Edges Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Connected Relationships
                </div>
                <div className="space-y-1.5">
                  {GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => {
                    const isOut = e.source === selectedNode.id;
                    const otherNodeId = isOut ? e.target : e.source;
                    const otherNode = layoutNodes.find(n => n.id === otherNodeId);
                    return (
                      <div key={e.id} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-500 font-medium">{e.label}</span>
                        <span className="font-semibold text-indigo-700 truncate max-w-[120px]">
                          {otherNode?.label || otherNodeId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  const decId = getDecisionForNode(selectedNode);
                  onSelectDecision(decId);
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <span>Explore Decision Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
