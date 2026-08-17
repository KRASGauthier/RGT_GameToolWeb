# Game Tool — Roadmap

<!-- TOC START -->
## Table of contents

- [Roadmap usage](#roadmap-usage)
- [Phase 1 — User Home & Projects](#phase-1--user-home--projects)
  - [User](#user)
  - [Projects](#projects)
- [Phase 2 — Project Management](#phase-2--project-management)
  - [Tasks](#tasks)
  - [Bugs](#bugs)
  - [Roadmap](#roadmap)
- [Phase 3 — Asset Manager](#phase-3--asset-manager)
- [Phase 4 — Git Project Integration](#phase-4--git-project-integration)
- [Phase 5 — Code Manager](#phase-5--code-manager)
- [Phase 6 — Data Registry](#phase-6--data-registry)
- [Phase 7 — Game Data Synchronization](#phase-7--game-data-synchronization)
- [Phase 8 — Structural Conflict Detection](#phase-8--structural-conflict-detection)
- [Phase 9 — Validation & Game Analysis](#phase-9--validation--game-analysis)
- [Long-term targets](#long-term-targets)
<!-- TOC END -->

## Roadmap usage

This is a **living roadmap**, not a frozen specification. Targets may be reordered, expanded, split, removed, or added as the project evolves.

Checkboxes represent implementation targets. The roadmap should remain focused on product direction; detailed technical architecture belongs in the appropriate `.info/` documentation once that architecture is actually established.

## Phase 1 — User Home & Projects

### User

- [ ] User authentication
- [ ] User home menu
- [ ] Personal account settings
- [ ] Personal application settings

### Projects

- [ ] Display projects available to the user
- [ ] Project selection
- [ ] Project creation
- [ ] Project information/settings
- [ ] Project management
- [ ] Project members / team management

## Phase 2 — Project Management

### Tasks

- [ ] To-do system
- [ ] Task status / priority / assignment
- [ ] Project-wide task overview

### Bugs

- [ ] Bug registry
- [ ] Bug details and reproduction information
- [ ] Images / references / attachments
- [ ] Status, priority and assignment
- [ ] Bug search and filtering

### Roadmap

- [ ] Editable project roadmap
- [ ] Targets / milestones
- [ ] Link roadmap targets to tasks and other project data
- [ ] Progress visualization

## Phase 3 — Asset Manager

- [ ] Asset registry
- [ ] Asset categories and metadata
- [ ] Track asset source / provenance
- [ ] Mark placeholder assets
- [ ] Mark AI-generated assets
- [ ] Mark assets without commercial usage rights
- [ ] Track assets that must be replaced before release
- [ ] Search / filter / inspect project assets

## Phase 4 — Git Project Integration

- [ ] Connect a Game Tool project to its Git repository
- [ ] Backend project checkout
- [ ] Pull/update the backend working copy
- [ ] Track repository revision used by Game Tool
- [ ] Safely generate project changes
- [ ] Commit generated data
- [ ] Push changes back to the repository

## Phase 5 — Code Manager

- [ ] Parse the game codebase
- [ ] Detect relevant classes / structures
- [ ] Parse inheritance
- [ ] Parse dependencies / includes
- [ ] Parse properties and supported data types
- [ ] Build an internal representation of the code structure
- [ ] Code structure browser
- [ ] Visualize relationships between game structures
- [ ] Refresh parsed structures when the repository changes

## Phase 6 — Data Registry

- [ ] Generate editable data structures from parsed code
- [ ] Create registry entries from available game types
- [ ] Edit primitive values
- [ ] Edit structured/nested values
- [ ] Support ranges and configurable values
- [ ] Reference other registry entries
- [ ] Validate entries against their code structure
- [ ] Search / filter / organize large registries

## Phase 7 — Game Data Synchronization

- [ ] Parse existing game data
- [ ] Import existing entries into the registry
- [ ] Keep registry representation compatible with game data
- [ ] Generate game-consumable data files
- [ ] Support multiple generated data sheets/files when required
- [ ] Preview generated changes
- [ ] Export through the Git workflow

## Phase 8 — Structural Conflict Detection

- [ ] Detect removed fields
- [ ] Detect renamed/unknown fields
- [ ] Detect field type changes
- [ ] Detect removed game types/classes
- [ ] Detect inheritance changes affecting existing data
- [ ] Detect broken registry references
- [ ] Detect existing data that no longer matches parsed code
- [ ] Conflict dashboard
- [ ] Help resolve/migrate conflicting data

## Phase 9 — Validation & Game Analysis

- [ ] Custom programmable validation rules
- [ ] Detect inconsistent game data
- [ ] Detect suspicious values
- [ ] Cross-entry consistency checks
- [ ] Balance-analysis tools
- [ ] Highlight statistical outliers
- [ ] Detect potentially unintended gameplay configurations
- [ ] Smarter automated analysis

## Long-term targets

- [ ] Improve relationships between management, assets, code, and registry data
- [ ] Link bugs/tasks directly to affected code/data/assets
- [ ] Project health overview
- [ ] Release-readiness checks
- [ ] Ensure no temporary/unlicensed assets remain before release
- [ ] Extend analysis tools as actual production needs appear
