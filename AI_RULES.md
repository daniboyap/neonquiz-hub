# AI Development Rules for NeonQuiz Hub

This document outlines the technical stack and development guidelines for the NeonQuiz Hub application. Following these rules ensures consistency, maintainability, and adherence to the project's architecture.

## Tech Stack

The application is built with a modern, lightweight, and performant stack:

-   **Framework:** React 19 with TypeScript for robust, type-safe components.
-   **Styling:** Tailwind CSS is used exclusively for all styling. It follows a utility-first approach for rapid and consistent UI development.
-   **Animations:** Framer Motion is the designated library for all UI animations, providing smooth and complex transitions.
-   **Icons:** Lucide React is the standard icon library, chosen for its extensive and customizable SVG icons.
-   **Build Tool:** Vite serves as the build tool and development server, offering fast startup and Hot Module Replacement (HMR).
-   **State Management:** State is managed locally within components using React Hooks (`useState`, `useEffect`). For global state-like data (e.g., categories), constants are used.
-   **Data Persistence:** `localStorage` is used for simple client-side data persistence, such as favorite categories and local rankings.
-   **Code Splitting:** Dynamic `import()` is a core architectural feature used in `data/loader.ts` to lazy-load question sets, ensuring a fast initial page load.

## Development Guidelines

### Component Structure

-   **Small & Focused:** Components should be small and responsible for a single piece of functionality.
-   **File Organization:** Place reusable components in `src/components/`. Keep data definitions in `src/data/` and type interfaces in `src/types.ts`.
-   **Styling:** **Do not use CSS files or inline styles.** All styling must be done with Tailwind CSS classes.

### Library Usage

-   **UI Components:** Build all components from scratch using `div`, `button`, etc., and style them with Tailwind CSS. Do not add component libraries like Shadcn/UI or Material-UI.
-   **Animations:** Use `framer-motion` for any dynamic UI effects (e.g., page transitions, list animations, modal pop-ups).
-   **Icons:** Only use icons from the `lucide-react` library. Icons are dynamically loaded in `App.tsx` via a helper function.
-   **Data Fetching:** The app currently loads all data locally. Do not add external data fetching libraries like `axios` or `react-query`.
-   **State Management:** For now, avoid adding complex state management libraries like Redux or Zustand. Rely on React's built-in hooks.

### Code Conventions

-   **TypeScript:** Use TypeScript for all new components and utilities. Define clear interfaces for props and data structures in `src/types.ts`.
-   **ESM Imports:** Use ES Modules (`import`/`export`) for all module handling. Avoid using CommonJS (`require`).
-   **Performance:** Be mindful of performance. Continue the lazy-loading pattern for any large data sets or components that are not immediately needed.
-   **Immutability:** When updating state, always create new objects or arrays instead of mutating existing ones.

By following these rules, we maintain a clean, efficient, and consistent codebase for the NeonQuiz Hub.