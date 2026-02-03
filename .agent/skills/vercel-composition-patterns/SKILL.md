---
name: vercel-composition-patterns
description: Patterns for building reusable and maintainable React components.
---

# Composition Patterns

## Composition vs Inheritance
Always prefer composition over inheritance. Use `children` prop to pass content into components.

## Container/Presentational Pattern
Separate business logic (Container) from UI rendering (Presentational).
- **Container**: Handles state, data fetching, and side effects.
- **Presentational**: Receives data via props and renders UI.

## Compound Components
Use compound components to manage implicit state between related components (e.g., `Select`, `Select.Option`).
```jsx
<Toggle>
  <Toggle.On>The button is on</Toggle.On>
  <Toggle.Off>The button is off</Toggle.Off>
  <Toggle.Button />
</Toggle>
```

## Controlled vs Uncontrolled Components
- **Controlled**: State is managed by the parent via props (`value`, `onChange`).
- **Uncontrolled**: State is managed internally, optionally exposing a ref.
Prefer controlled components for complex form inputs.

## Slots Pattern
For complex layouts, avoid multiple boolean props. Use "slots" (props that accept ReactElements).
```jsx
<PageLayout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<Content />}
/>
```
