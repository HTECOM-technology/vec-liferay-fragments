# AI Agents Configuration

This file documents the AI agents and their responsibilities within this project.

## Agents

- **Antigravity**: Primary coding assistant for general tasks, refactoring, and bug fixes.

## Tech Stack

- **Core**: React 19, React DOM 19
- **Routing**: React Router DOM 7
- **UI Framework**: Ant Design 5 (@ant-design/v5-patch-for-react-19)
- **Styling**: Styled-components 6
- **Build Tool**: React Scripts 5 with Craco 7
- **Utilities**: Dayjs
- **Testing**: Jest, React Testing Library

## Development Rules

### Liferay Integration
- **Public Path**: Must be set to `/o/liferay-react-fragment/` (configured in `craco.config.js`).
- **Build Sync**: Use `npm run build:liferay` to build the project and execute `sync-to-liferay.js`.
- **Fragment Structure**: Output must be compatible with Liferay Fragment stricture.

### Routing
- Define paths in `src/router/menuConfig.js`.
- Use `menuItems` and `menuSections` for sidebar configuration.

## Skills

- **Build & Deploy**: Capability to run `npm run build:liferay` and verify output.
- **Component Design**: Adhere to Ant Design 5 principles.
- **Composition Patterns**: Apply `vercel-composition-patterns` for scalable component architecture.
- **React Best Practices**: Follow `vercel-react-best-practices` for performance and clean code.
- **Web Design**: Implement `web-design-guidelines` for premium UI/UX.
