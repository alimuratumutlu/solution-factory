import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Bot,
  CheckCircle2,
  Code2,
  FileCheck,
  GitBranch,
  Play,
  ShieldCheck,
  SquareTerminal,
} from "lucide-react";
import "./App.css";

type PipelineNodeData = {
  label: string;
  runtime: string;
  description: string;
  outputs: string[];
};

const pipelineNodes: Node<PipelineNodeData>[] = [
  {
    id: "brief",
    type: "default",
    position: { x: 0, y: 120 },
    data: {
      label: "Brief Checkpoint",
      runtime: "checkpoint",
      description: "Verify the selected repository has enough product context.",
      outputs: ["context-docs/brief.md"],
    },
  },
  {
    id: "pm",
    position: { x: 280, y: 40 },
    data: {
      label: "PM Spec",
      runtime: "codex",
      description: "Turn the brief into requirements and acceptance criteria.",
      outputs: ["docs/requirements.md"],
    },
  },
  {
    id: "techlead",
    position: { x: 560, y: 40 },
    data: {
      label: "Tech Architecture",
      runtime: "codex",
      description: "Choose stack, data flow, API contracts, and implementation tasks.",
      outputs: ["docs/architecture.md"],
    },
  },
  {
    id: "backend",
    position: { x: 840, y: 0 },
    data: {
      label: "Backend Implementation",
      runtime: "claude",
      description: "Generate API, services, validation, and data access.",
      outputs: ["src/backend"],
    },
  },
  {
    id: "frontend",
    position: { x: 840, y: 180 },
    data: {
      label: "Frontend Implementation",
      runtime: "codex",
      description: "Generate UI screens, state, forms, and API integration.",
      outputs: ["src/frontend"],
    },
  },
  {
    id: "test",
    position: { x: 1120, y: 90 },
    data: {
      label: "Test Suite",
      runtime: "shell",
      description: "Run local build, lint, type-check, and test commands.",
      outputs: ["logs/test-run.log"],
    },
  },
  {
    id: "qa",
    position: { x: 1400, y: 90 },
    data: {
      label: "QA Review",
      runtime: "qa_review",
      description: "Review generated artifacts and route blocking fixes back.",
      outputs: ["docs/test-report.md"],
    },
  },
  {
    id: "release",
    position: { x: 1680, y: 90 },
    data: {
      label: "Release",
      runtime: "release",
      description: "Create release notes and prepare macOS artifacts.",
      outputs: ["CHANGELOG.md"],
    },
  },
];

const pipelineEdges: Edge[] = [
  { id: "brief-pm", source: "brief", target: "pm" },
  { id: "pm-techlead", source: "pm", target: "techlead" },
  { id: "techlead-backend", source: "techlead", target: "backend" },
  { id: "techlead-frontend", source: "techlead", target: "frontend" },
  { id: "backend-test", source: "backend", target: "test" },
  { id: "frontend-test", source: "frontend", target: "test" },
  { id: "test-qa", source: "test", target: "qa" },
  { id: "qa-release", source: "qa", target: "release" },
  {
    id: "qa-backend",
    source: "qa",
    target: "backend",
    animated: true,
    label: "fix loop",
  },
  {
    id: "qa-frontend",
    source: "qa",
    target: "frontend",
    animated: true,
    label: "fix loop",
  },
];

const runtimeSummary = [
  { label: "Codex", icon: Bot, detail: "Planning, architecture, implementation" },
  { label: "Claude Code", icon: Code2, detail: "Implementation and review adapters" },
  { label: "Shell", icon: SquareTerminal, detail: "Builds, tests, scripts, release commands" },
  { label: "Checkpoints", icon: FileCheck, detail: "Expected files and artifacts" },
  { label: "QA Loops", icon: ShieldCheck, detail: "Route failures back to owners" },
];

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GitBranch size={22} />
          </div>
          <div>
            <p>App Factory</p>
            <h1>Workbench</h1>
          </div>
        </div>

        <section className="panel">
          <div className="panel-heading">
            <span>Pipeline</span>
            <button type="button" aria-label="Run pipeline">
              <Play size={16} />
              Run
            </button>
          </div>
          <h2>Fullstack App Factory</h2>
          <p>
            Visual runner for local coding-agent pipelines that execute against
            a real repository.
          </p>
        </section>

        <section className="panel compact">
          <h2>Runtime Nodes</h2>
          <ul className="runtime-list">
            {runtimeSummary.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Icon size={17} />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>Open local orchestration standard</p>
            <h2>Codex and Claude CLI pipeline canvas</h2>
          </div>
          <div className="status-pill">
            <CheckCircle2 size={16} />
            v0.1 scaffold
          </div>
        </header>

        <div className="flow-frame">
          <ReactFlow
            nodes={pipelineNodes}
            edges={pipelineEdges}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable
            nodesConnectable={false}
          >
            <Background gap={22} size={1} />
            <MiniMap pannable zoomable />
            <Controls />
          </ReactFlow>
        </div>

        <footer className="artifact-bar">
          <span>Artifacts</span>
          <code>docs/requirements.md</code>
          <code>docs/architecture.md</code>
          <code>src/backend</code>
          <code>src/frontend</code>
          <code>docs/test-report.md</code>
        </footer>
      </section>
    </main>
  );
}

export default App;
