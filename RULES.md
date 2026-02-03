# Coding Rules

## General
- Use strict equality (`===`) over loose equality (`==`).
- Async/await is preferred over raw Promises.
- React functional components with Hooks.

## Styling
- Use `styled-components` for component-level styling.
- Minimize use of inline styles.

## Liferay Specific
- Ensure all resources are loaded via the correct public path.
- Fragment configuration must specify correct JS/CSS entries.
- Fragment configuration must specify correct JS/CSS entries.

## AI Agent Behavior
When generating code, the AI **MUST** strictly adhere to the following skills:
1. **[vercel-composition-patterns](.agent/skills/vercel-composition-patterns/SKILL.md)**: Use composition over inheritance, separate container/presentational layers, and use slots for complex layouts.
2. **[vercel-react-best-practices](.agent/skills/vercel-react-best-practices/SKILL.md)**: Follow hooks rules, optimize performance (memoization), and manage state efficiently.
3. **[web-design-guidelines](.agent/skills/web-design-guidelines/SKILL.md)**: Ensure premium aesthetics, responsiveness, and accessibility in all UI components.
4. **SonarLint Check**: For every change or new component, you MUST anticipate and fix common SonarLint issues (e.g., PropType validation, unused variables, empty blocks). Ideally, run a mental "lint" before finalizing code.
