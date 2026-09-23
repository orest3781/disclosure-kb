# Web starters: notes

Catalog: [catalog/web-starters.md](../catalog/web-starters.md)

- **Whether to use a starter at all.** A 3D game is mostly a client-side canvas. The heavyweight SaaS starters (auth, billing, multi-tenancy) only matter if the game gets accounts, cloud saves or leaderboards.
- **If the game lives inside oresth.com**, keep its stack (Next 16, React 19, Tailwind 4, Vitest). Copy only the jsdom + Testing Library + Playwright setup from `ixartz/Next-js-Boilerplate`. That fills the "no component test harness" gap in oresth.com's STATUS.md.
- **If it becomes its own site**, start from `create-next-app` and add the canvas wiring from `pmndrs/react-three-next` (see 3d-tech). Add `create-t3-app` pieces (tRPC + Drizzle + auth) only when saves need to go to a server.
- **The AI SDK** (`vercel/ai`, `vercel/chatbot`) is the route to LLM-driven witness interviews. Both report a NOASSERTION licence, so read the LICENSE file first.
