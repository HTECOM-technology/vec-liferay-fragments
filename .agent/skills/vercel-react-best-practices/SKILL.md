---
name: vercel-react-best-practices
description: Best practices for React development, performance, and state management.
---

# React Best Practices

## Hooks Rules
- Only call hooks at the top level.
- Only call hooks from React function components or custom hooks.
- Exhaustive deps: Always include all dependencies in `useEffect`, `useMemo`, and `useCallback`.

## State Management
- **Lift State Up**: If multiple components need the same state, move it to their closest common ancestor.
- **Server State**: Use libraries (like React Query or SWR) for caching server data instead of global state stores if possible.
- **Context API**: Use sparingly for global theme/auth data. Avoid using it for rapidly changing data to prevent unnecessary re-renders.

## Performance Optimization
- **Code Splitting**: Use `React.lazy` and `Suspense` for route-based splitting.
- **Memoization**: Use `useMemo` for expensive calculations and `useCallback` for stable function references passed to child components.
- **Virtualization**: Use virtualization (e.g., `react-window`) for long lists.

## Component Structure
- Keep components small and focused (Single Responsibility Principle).
- File structure: Colocate tests and styles with the component.
