# Solution Factory PRD

## Product Intent

Solution Factory turns a user's messy problem into a structured solution map.
The app should help the user understand the real bottleneck, reverse-engineer
the desired outcome into smaller steps, and review progress through editable
views such as pipeline, graph, kanban, timeline, and table.

The product is not an AI life coach that immediately gives generic advice. It
is a local-first desktop workbench for thinking clearly, choosing the next move,
and revising the plan when reality changes.

## Core Promise

Turn life problems, projects, and decisions into practical solution maps.

## Primary User Flow

1. The user creates or opens a workspace.
2. The user describes a problem, goal, decision, or life situation.
3. The app asks fixed intake questions and AI-generated follow-up questions.
4. The app reflects the understood problem before proposing a plan.
5. The user confirms or corrects the reflection.
6. The app reverse-engineers a solution map from the desired outcome backward.
7. The user inspects and edits the plan through multiple views.
8. The user reviews checkpoints and updates the plan over time.

## Solution Map Requirements

A solution map must include:

- original user problem
- understood problem
- main bottleneck
- desired outcome
- constraints and resources
- subgoals
- first 7 days
- first 30 days
- actions
- milestones
- decision points
- risks
- anti-goals
- checkpoints
- optional support practices

The canonical model lives in `schema/solution-map.schema.json`. Goal pipelines
are a view and orchestration format; solution maps are the product's core domain
object.

## Spiritual Support

Spiritual support is optional and controlled by user settings. It must never be
forced into a plan by default.

The app may offer spiritual support when:

- the user enables it in settings
- the user chooses a spiritual support mode
- the plan context matches an intention category
- the app can explain why a practice was suggested

Spiritual support can include:

- Esma suggestions
- dua or dhikr suggestions
- intention categories
- suggested count
- suggested day
- optional time of day
- reflection prompt
- reminder/checkpoint integration

Spiritual support must be framed as reflective support, not as a guaranteed
cause of an outcome. The app must avoid unsupported religious, medical,
financial, legal, or supernatural claims.

## Spiritual Support Settings

The user should be able to configure:

- enabled or disabled
- support mode: off, gentle, integrated
- preferred practice types: Esma, Dua, Dhikr
- preferred reminder times
- whether AI can suggest spiritual practices
- whether spiritual practices can appear inside the solution map
- whether spiritual practices can create reminders

If support is disabled, no Esma or dhikr recommendation should be generated or
shown in plan output.

## Spiritual Practice Catalog

The initial catalog can be derived from the `5-min-dhikr` project:

- source path: `/Users/muratumutlu/Hassar/app-projects/5-min-dhikr`
- reusable data: `lib/coreDhikrs.ts`
- known catalog size: 104 practices
- known types: 100 Esma, 4 Dua
- known fields: id, Arabic/display text, transliteration, timing/day,
  target count, category, intentions

The imported catalog must preserve day and count fields. Exact clock time should
be modeled separately as `timeOfDay` and can come from user reminder settings or
a reviewed source if one exists.

## Guardrails

- Ask first, suggest second.
- Reflect the problem before generating a plan.
- Keep spiritual support optional.
- Keep source/review metadata for religious content.
- Do not claim a practice solves a real-world problem by itself.
- Distinguish practical actions from reflective/spiritual practices.
- For medical, legal, financial, safety, or mental-health topics, show
  appropriate high-stakes disclaimers and encourage professional help where
  needed.

## MVP Scope

The next meaningful MVP should include:

- workspace and empty-state intake
- AI provider settings
- user spiritual support settings
- intake questions
- problem reflection with correction
- solution map generation
- spiritual support catalog model
- optional Esma/Dua recommendation block
- pipeline and table rendering from the same solution map
