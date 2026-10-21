# Coderman assistant — 21 October 2026

Production: https://studio-site-jade.vercel.app
Deployment: dpl_6TaqfxvqyXNX4UQxDJ8wQPV3AK8Q

Dark graphite/teal theme across page, gallery and forms; dark portfolio previews. Persistent levitating corner character opens chat and four-step deterministic guided tour. Studio-written quick answers remain usable without provider connectivity. AI uses server-side OpenRouter credential and openrouter/free; no visitor key or login needed. Character is expressive but identified as AI. No persistent chat storage; recent messages are sent to OpenRouter.

Validation: production build, oxlint, 320/390/768px overflow checks, four tour stops, Escape, fallback UI, API method/origin/schema/throttle checks. Live provider returned 200 before deployment.

Operational limits: free model availability and provider quotas may affect response time. In-memory per-IP throttle is best effort per server instance, not a global durable limiter. Free-only routing avoids paid model charges. Vite alone does not serve /api/chat; use Vercel dev with server environment for local full-stack work.

Final production API verified HTTP 200 with clean studio/pricing answer. Reasoning excluded and drafting-note guard enabled.

