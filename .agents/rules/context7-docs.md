---
trigger: always_on
---

# Context7 MCP Documentation Rule

Whenever you are writing, updating, or refactoring code that involves external libraries, frameworks, SDKs, APIs, UI packages, or dependencies (e.g., React, TanStack Query, Zustand, Lucide-react, Tailwind, Vite, Axios, DOMPurify, React Router, etc.), you MUST ALWAYS fetch up-to-date documentation from the Context7 MCP server before proceeding.

## Required Workflow

1. **Resolve Library ID**:
   - Call `resolve-library-id` using the official library name and a specific description of what you are implementing or debugging.
   - Select the optimal `libraryId` (format: `/org/project`) based on exact name match, benchmark score, and snippet coverage.

2. **Query Documentation**:
   - Call `query-docs` with the resolved `libraryId` and a clear, focused query scoped to a single concept.
   - If the task covers multiple distinct API topics, make separate `query-docs` calls for each concept.

3. **Implementation**:
   - Base all API usages, component props, hook signatures, and configuration settings strictly on the retrieved Context7 documentation to avoid deprecated patterns or outdated syntaxes.

## Exceptions
- Do NOT invoke Context7 for custom repository-internal logic, business rules, or refactoring custom UI components that do not rely on third-party API changes.
