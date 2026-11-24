---
trigger: always_on
---

# Code Compliance Rules (Accessibility, Performance & Security)

Any modifications, refactoring, or new code added to the codebase MUST pass the automated audit scripts for accessibility, performance, and security. Follow these guidelines strictly.

---

## ♿ 1. Accessibility (A11y) Compliance

The project runs semantic checks on `.tsx` files. Always write accessible elements:

### Rule 1.1: Image Alt Attributes
Every `<img>` tag must have an explicit `alt` attribute.
* **BAD**: `<img src={src} />`
* **GOOD**: `<img src={src} alt="Property listing hero image" />` or `<img src={src} alt="" />` (for purely decorative images)

### Rule 1.2: Form Input Labeling
Every `<input>` element must have an explicit connection for screen readers. It must have either an `id` that links to a `<label htmlFor="...">`, or an `aria-label`/`aria-labelledby` attribute.
* **BAD**: `<input type="text" value={val} onChange={change} />`
* **GOOD**: 
  - `<input id="search-input" type="text" value={val} ... />` (linked with `<label htmlFor="search-input">Search</label>`)
  - `<input type="text" aria-label="Search properties" value={val} ... />`

### Rule 1.3: Button Contents
Buttons must not be empty. If a button only contains an icon or is empty, it MUST have an `aria-label` or `aria-labelledby`.
* **BAD**: `<button onClick={handlePrev}><ChevronLeftIcon /></button>`
* **GOOD**: `<button onClick={handlePrev} aria-label="Previous image"><ChevronLeftIcon /></button>`

### Rule 1.4: Logical Heading Hierarchy
Avoid skipping heading levels within a single component. Do not jump from `h2` to `h4` or `h1` to `h3`.
* **BAD**:
  ```tsx
  <h2>Property Title</h2>
  <h4>Property Specifications</h4>
  ```
* **GOOD**:
  ```tsx
  <h2>Property Title</h2>
  <h3>Property Specifications</h3>
  ```

---

## ⚡ 2. Performance Compliance

To keep build times fast, bundle sizes small, and render behaviors optimized:

### Rule 2.1: File Size Limit (Code Splitting)
Component and page files must be kept under **25KB** (approx 600 lines). If a component exceeds 25KB, you MUST split it into smaller, focused sub-components.
* **GOOD**: Break down a large property details page into `PropertyGallery.tsx`, `PropertySpecifications.tsx`, `PropertyContactForm.tsx`, etc.

### Rule 2.2: Zustand Store Selectors
Do not subscribe to an entire Zustand store. Always use a selector function to retrieve only the specific slice of state needed.
* **BAD**: `const store = useStore()` or `const auth = authStore()`
* **GOOD**: `const user = useStore(state => state.user)`

### Rule 2.3: Query Hook Abort Signals
When defining React Query / TanStack hooks in files containing `queries.ts`, always utilize the `signal` argument from the Query Function context to support network request cancellation.
* **BAD**:
  ```ts
  useQuery({
    queryKey: ['members'],
    queryFn: () => axios.get('/api/members')
  })
  ```
* **GOOD**:
  ```ts
  useQuery({
    queryKey: ['members'],
    queryFn: ({ signal }) => axios.get('/api/members', { signal })
  })
  ```

### Rule 2.4: Lucide-React Tree-shaking
Never import all Lucide icons or import Lucide as a namespace/default. Import icons individually.
* **BAD**: `import * as Lucide from 'lucide-react'` or `import Lucide from 'lucide-react'`
* **GOOD**: `import { Search, ChevronLeft, Home } from 'lucide-react'`

---

## 🔒 3. Security Compliance

Prevent XSS attacks, credential leaks, and insecure data handling:

### Rule 3.1: Sanitized DangerouslySetInnerHTML
Avoid `dangerouslySetInnerHTML`. If it is absolutely necessary (e.g. rendering rich text content from TipTap), you MUST wrap the input using `dompurify` to prevent XSS.
* **BAD**: `<div dangerouslySetInnerHTML={{ __html: content }} />`
* **GOOD**: 
  ```tsx
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```

### Rule 3.2: Secrets Scanning
Never write secrets, passwords, auth tokens, API keys, or private keys directly in the code (except in mock-data, env configurations, or httpClient). Use environment variables (`.env`) instead.

### Rule 3.3: Insecure Storage of Tokens
Do not save sensitive authentication credentials or sessions in `localStorage`. Use secure HTTP-only cookies (`js-cookie` or backend headers) to prevent token theft via XSS.
* **BAD**: `localStorage.setItem('auth_token', token)`
* **GOOD**: `Cookies.set('auth_token', token, { secure: true, sameSite: 'strict' })`

### Rule 3.4: window.location redirects
Do not use raw `window.location.href = ...` for redirects. Always prefer the react-router navigation tools (`useNavigate()`, `<Navigate />`) or standard structured application path maps.
* **BAD**: `window.location.href = '/dashboard/leads'`
* **GOOD**: `navigate(paths.dashboard.leads)`
