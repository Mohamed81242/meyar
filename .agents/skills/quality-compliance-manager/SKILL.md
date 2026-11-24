---
name: quality-compliance-manager
description: >-
  Runs quality compliance audits (accessibility, performance, security) and parses reports to provide actionable code refactoring to repair violations.
---

# Quality Compliance Manager

## Overview
This skill provides automated mechanisms to run the project's quality compliance engine, parse accessibility, performance, and security reports, and retrieve actionable developer advice to maintain high code standards.

## Quick Start
To get a quick overview of project compliance and failed files:
```bash
python .agents/skills/quality-compliance-manager/scripts/audit_helper.py status
```

To view issues for a specific file:
```bash
python .agents/skills/quality-compliance-manager/scripts/audit_helper.py file-details --file "src/shared/builder/templates/velora/sections/hero/HeroSection.tsx"
```

## Utility Script
The custom helper script `audit_helper.py` compiles and queries the node audit engine.

### Subcommands:

1. **`status`**
   - Automatically executes `npx tsx scripts/test-accessibility.ts`, `npx tsx scripts/test-performance.ts`, `npx tsx scripts/test-security.ts`, and `vitest` in JSON mode.
   - Outputs the computed score sheet and lists files flagged with issues.
   - Syntax:
     ```bash
     python .agents/skills/quality-compliance-manager/scripts/audit_helper.py status
     ```

2. **`file-details`**
   - Takes a file path relative to process root.
   - Shows its score and listed failures across all three categories.
   - Syntax:
     ```bash
     python .agents/skills/quality-compliance-manager/scripts/audit_helper.py file-details --file <relative_path>
     ```

3. **`explain-fix`**
   - Resolves advice and gives correct vs incorrect examples for audit rules.
   - Options include: `alt-attribute`, `input-labeling`, `empty-button`, `heading-skipping`, `file-size`, `zustand-selector`, `query-signal`, `lucide-treeshaking`, `dangerously-set-html`, `session-storage`, `window-redirect`.
   - Syntax:
     ```bash
     python .agents/skills/quality-compliance-manager/scripts/audit_helper.py explain-fix --rule <rule_id>
     ```

## Common Violations & Solutions

### 1. Missing Image Alt
- **Failure**: `Missing 'alt' attribute on image`
- **Solution**: Add `alt=""` or a meaningful description.
- **Example**:
  ```tsx
  // BAD
  <img src={url} />
  // GOOD
  <img src={url} alt="Villa backyard" />
  ```

### 2. Input lacks label
- **Failure**: `Input element lacks explicit id, aria-label, or aria-labelledby`
- **Solution**: Add an `id` that matches a label's `htmlFor` or add an `aria-label`.
- **Example**:
  ```tsx
  // BAD
  <input type="text" />
  // GOOD
  <input type="text" aria-label="Search" />
  ```

### 3. Star imports of Lucide
- **Failure**: `Lucide icons should be imported individually`
- **Solution**: Avoid `import * as Lucide` or `import Lucide`. Explicitly destruct the icons.
- **Example**:
  ```tsx
  // BAD
  import * as Lucide from 'lucide-react';
  <Lucide.Home />
  // GOOD
  import { Home } from 'lucide-react';
  <Home />
  ```
