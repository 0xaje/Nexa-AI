# Development Workflow & Standards
### Engineering Guidelines for Nexa AI

---

## 1. Coding Standards

To ensure codebase quality, security, and maintainability, all contributors must adhere to the following standards:

### I. TypeScript & ESM Rules
*   **Strict Typing**: Enable `strict` in `tsconfig.json`. Avoid `any` types unless interfacing with un-typed external modules; use explicit interface schemas instead.
*   **ES Module Syntax**: Always use standard ES Module imports/exports (`import`/`export`) in application source code. Hardhat configuration files utilize CommonJS (`cjs`) only where required by the Hardhat compiler task wrapper.
*   **Explicit File Extensions**: In backend Node/TypeScript configurations, ensure relative imports specify the target file type where required by the runtime.

### II. Decoupling Rules
*   **Strict Layer Separation**: Never import database adapters or crawler scraping systems into smart contract helper directories. 
*   **Dynamic Configurations**: Never hardcode addresses, API keys, explorer endpoints, or token variables. All configuration details must be retrieved from the central [config/protocol/protocol.ts](file:///home/oyeolorun/AiraMarKet/config/protocol/protocol.ts) or chain configuration modules.

### III. Formatting
*   Use standard ESLint configurations. Indent with 2 spaces. Ensure files terminate with a single trailing newline.

---

## 2. Branch Strategy

We utilize a structured Git Flow model to coordinate concurrent development and protect release stability:

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  develop │ <─── │ feature/*│ <─── │ Developer│
└────┬─────┘      └──────────┘      └──────────┘
     │ (Release Preparation)
     ▼
┌──────────┐
│  release │
└────┬─────┘
     ├──────────────────────┐
     ▼                      ▼
┌──────────┐           ┌──────────┐
│   main   │           │ hotfix/* │ (Emergency Fix)
└──────────┘           └──────────┘
```

*   **`main`**: Reflects the active, production-ready release state. Direct commits to `main` are strictly prohibited.
*   **`develop`**: The primary integration branch for ongoing development. All feature branches merge here via Pull Requests.
*   **`feature/*`**: Dedicated branches for specific features or refactoring tasks. Branched off `develop` and merged back via approved PRs.
*   **`release/*`**: Branches prepared for staging audit and final testing prior to production launch. Branched off `develop` and merged to both `main` and `develop`.
*   **`hotfix/*`**: Emergency branches built to fix critical production issues directly. Branched off `main` and merged to both `main` and `develop`.

---

## 3. Commit Convention

Commit messages must follow the **Conventional Commits** specification to enable automated changelog generation:

```
<type>(<scope>): <description>

[optional body]
```

### Supported Types
*   `feat`: A new user-facing product feature.
*   `fix`: A bug resolution in code, backend services, or UI.
*   `chore`: Tooling updates, package lock synchronization, or configuration tweaks.
*   `docs`: Documentation-only updates (markdown files, developer guides).
*   `style`: Code formatting adjustments, layouts, or CSS optimizations.
*   `refactor`: Structural code updates that neither fix bugs nor add features.
*   `test`: Appending or refining Hardhat unit tests or backend validator tasks.

### Example Commits
```bash
feat(agent): implement politics sentiment parser with confidence thresholds
fix(indexer): resolve HTTP JSON-RPC rate-limit disconnect crashes
chore(deps): update prisma client dependency to version 5.10.0
```
