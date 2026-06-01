# Architecture

## Positioning

App Factory Workbench is a local-first desktop runner for software-delivery
agent pipelines. It is narrower than n8n, Dify, or Flowise: the workflows are
designed for repositories, coding agents, shell commands, test suites, QA, and
release tasks.

## Stack

- Desktop shell: Tauri
- UI: React, TypeScript, React Flow
- Command runner: Rust
- Pipeline format: JSON
- Templates: checked into `examples/`

## Core Concepts

### Pipeline

A pipeline is a graph of nodes and edges. Nodes declare runtime type, input
files, output files, prompt files, command configuration, and success criteria.

### Node Runtime

Initial runtime types:

- `codex`
- `claude`
- `shell`
- `checkpoint`
- `manual_gate`
- `qa_review`
- `release`

### Runner

The runner executes nodes in dependency order. v0.2 starts with sequential
execution. Parallel execution should wait until cancellation, logs, and state are
stable.

### Artifacts

Each node can write artifacts to the target repository:

- generated docs
- code files
- test reports
- logs
- release notes

## Security Model

Shell, Codex, and Claude nodes can execute local commands. The first release must
make this explicit and visible:

- show the command before execution
- require a trusted repository
- keep logs on disk
- never hide shell activity from the user

Sandboxing and allowlists are future work.
