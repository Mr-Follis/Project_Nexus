# Hermes Agent Cron Workflows v0.2

## Purpose

This document defines the Hermes Agent workflows that should support Project Nexus after the core app is in place. Hermes should act as the operational intelligence layer: it watches, researches, triages and prepares work for review.

## Operating principle

Hermes prepares. Humans approve. The app publishes.

## Core Hermes agents

### 1. Source Watcher Agent

Checks official and trusted public sources for updates.

Runs:
- Hourly during launch window
- Daily during quieter periods

Outputs:
- Source change summary
- Suggested database updates
- Suggested article drafts
- Confidence score
- Admin review task

### 2. Community Triage Agent

Reviews new user submissions.

Runs:
- Hourly
- On demand during launch week

Outputs:
- Category classification
- Duplicate detection
- Missing evidence flags
- Trust/risk score
- Suggested moderation action

### 3. SEO Opportunity Agent

Finds new pages or improvements based on search logs, zero-result searches, rankings and competitor deltas.

Runs:
- Daily

Outputs:
- New page ideas
- Existing page refresh list
- Internal-link suggestions
- FAQ suggestions
- Priority score

### 4. Stale Data Agent

Finds records that may be outdated after patches or new discoveries.

Runs:
- Daily after launch
- Weekly after launch stabilises

Outputs:
- Records needing verification
- Pages with outdated claims
- Missing source links
- Suggested verification tasks

### 5. Knowledge Graph Gap Agent

Finds missing relationships between entities.

Runs:
- Weekly

Outputs:
- Vehicles not linked to map markers
- Missions missing rewards
- Weapons missing unlock conditions
- Guides missing related entities
- Suggested relationship updates

### 6. Owner Briefing Agent

Produces a simple admin summary.

Runs:
- Daily morning

Outputs:
- What changed
- What needs approval
- What traffic is doing
- What content is missing
- What broke
- What to focus on today

## Launch-week mode

During GTA 6 launch week, increase frequency:

- Source Watcher: hourly
- Community Triage: hourly or manual burst mode
- SEO Opportunity: daily
- Site Health: every 15 to 30 minutes if supported by infrastructure
- Owner Briefing: morning and evening

## Safety and approval

Hermes should not publish final factual claims automatically in the MVP.

Allowed automatic actions:
- Create draft records
- Create draft articles
- Create admin review tasks
- Create GitHub issues
- Produce reports
- Run read-only scans
- Trigger deterministic scripts with safe permissions

Human approval required:
- Public articles
- Database fact updates
- Verification status changes
- User-facing rankings
- Monetised recommendations
- Any deletion of content/data

## Required logs

Every Hermes run should log:

- Agent name
- Schedule
- Start time
- End time
- Sources checked
- Actions taken
- API/tool calls made
- AI cost estimate
- Output destination
- Errors
- Human review status

## Workflow outputs

Hermes outputs should land in one of these places:

- Admin review queue
- GitHub issue/task
- Owner daily report
- Local markdown report
- Slack/Telegram/WhatsApp alert if connected later
- Database draft table via safe API endpoint

## MVP implementation note

Start with only three Hermes jobs:

1. Daily Owner Briefing
2. Hourly Source Watcher
3. Daily SEO Opportunity Agent

Add more only after the core app, database and admin workflow are stable.
