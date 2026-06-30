# AI Assistant and RAG Architecture

## 1. Goal

The AI assistant should feel like a game companion, not a generic chatbot.

It should answer from the Nexus knowledge graph and approved guide content, then return useful actions such as opening map pins, comparing entities, saving a plan, or showing related guides.

## 2. Core assistant rules

1. Use verified Nexus data first.
2. Do not invent missing facts.
3. Label uncertain data clearly.
4. Prefer short, actionable answers.
5. Include related actions.
6. Cite internal pages/sources in the UI.
7. Log unanswered questions for content improvement.

## 3. Retrieval sources

Assistant can retrieve:

- Entity summaries
- Entity relationships
- Map markers
- Guide chunks
- FAQ blocks
- Patch/update summaries
- User progress data if logged in and permitted

Assistant should not retrieve:

- Draft/unapproved data unless user/admin mode allows it.
- Rejected submissions.
- Speculative data unless explicitly requested.

## 4. Query intent types

- Location query: “Where is X?”
- Unlock query: “How do I get X?”
- Comparison query: “Is X better than Y?”
- Recommendation query: “What should I buy/use/do?”
- Mission help: “How do I beat mission X?”
- Money optimisation: “Fastest way to make X.”
- Progress query: “What am I missing?”
- Patch query: “What changed?”
- Speculative/pre-release query
- General guide query

## 5. Answer structure

Recommended response schema:

```json
{
  "answer_type": "location|comparison|plan|guide|unknown",
  "direct_answer": "string",
  "confidence": "confirmed|community_verified|likely|speculative|unknown",
  "assumptions": ["string"],
  "steps": ["string"],
  "actions": [
    {"type": "open_map", "label": "Show on map", "target_id": "uuid"},
    {"type": "open_guide", "label": "Read guide", "target_id": "uuid"}
  ],
  "sources": [
    {"title": "string", "url": "string", "last_verified": "date"}
  ],
  "follow_up_questions": ["string"]
}
```

## 6. RAG pipeline

1. User query received.
2. Intent classifier runs.
3. Entity resolver identifies matching entities/aliases.
4. Retrieval fetches structured records and content chunks.
5. Confidence/status filter removes unapproved content.
6. Answer generator produces structured response.
7. Validator checks for unsupported claims.
8. UI renders answer cards.
9. Analytics logs outcome.

## 7. Hallucination guardrails

- Required: retrieved data must support factual claims.
- If key data missing, answer “not confirmed yet.”
- Do not estimate stats unless labelled estimate.
- Do not treat Reddit/creator claims as official.
- Do not reveal unpublished admin notes.
- Do not offer cheats/exploits that break platform/game rules if risky.

## 8. Personalisation

When logged in, the assistant can use:

- Saved vehicles/items
- Found/completed markers
- Owned businesses
- Current cash entered by user
- Preferred play style
- Spoiler preference

Personalisation must be explicit and user-controlled.

## 9. Admin-facing AI

Admin AI tools:

- Summarise submission.
- Detect duplicates.
- Extract fields from text/screenshot.
- Suggest relationships.
- Draft guide from records.
- Generate SEO title/meta.
- Detect stale pages.
- Cluster failed searches.

Admin AI output must always show:

- Confidence
- Source references
- Proposed changes
- Fields affected
- Publish risk

## 10. Evaluation

Test assistant on datasets:

- Known answer questions
- Unknown answer questions
- Speculative queries
- Outdated data queries
- Comparison queries
- Multi-step plan queries
- Spoiler-sensitive queries

Metrics:

- Accuracy
- Source support
- Refusal/unknown correctness
- Action usefulness
- User helpfulness rating
- Average latency
- Cost per answer

## 11. Cost controls

- Use search/structured DB before AI when possible.
- Cache common answers.
- Use smaller/cheaper models for classification/extraction.
- Use batch jobs for content generation.
- Limit context size.
- Log expensive queries.

## 12. MVP assistant scope

Must answer:

- Entity lookup
- Basic location queries
- Basic unlock queries
- Basic comparison from known stats
- Basic guide answers
- Unknown/pre-release data with humility

Not MVP:

- Fully personalised play plans
- Voice interface
- Real-time co-play assistant
- Multi-user party planning
