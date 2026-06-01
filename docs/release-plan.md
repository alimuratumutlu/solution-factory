# macOS Release Plan

## Release Goals

The first public macOS release should prove one thing: a developer can design a
local coding-agent pipeline and run it against a repository with visible logs,
artifacts, and checkpoints.

## v0.1 Release

Scope:

- Public GitHub repository
- Tauri desktop scaffold
- React Flow workbench prototype
- Pipeline JSON schema
- Example fullstack pipeline
- README, roadmap, issue templates

Verification:

- `npm run build`
- Schema and example JSON parse successfully

## v0.2 Release

Scope:

- Shell node execution through Rust
- Log streaming
- Node status updates
- File checkpoint validation

Verification:

- Run a pipeline with `npm run test` or `npm run build`
- Confirm failed shell command marks node as failed
- Confirm checkpoint node validates output files

## v0.5 macOS Release Candidate

Scope:

- Signed macOS app
- Release artifact on GitHub Releases
- Apple Silicon release first; Intel x86_64 packaging is tracked separately
- Demo pipeline included
- Installation instructions

Open questions:

- Signing identity and Apple Developer account
- Notarization workflow
- Auto-update strategy
- Whether releases should ship as `.dmg`, `.app.zip`, or both
