# Agent Guidelines for Doctor Directory

## Essential Commands

### Development & Building
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Testing
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Run Vitest with UI (watch mode)
- `npm run test:coverage` - Generate coverage reports
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright with interactive UI
- `npm run test:e2e:debug` - Debug Playwright tests with inspector
- `npm run test:e2e:install` - Install Playwright browsers

### Running Single Tests
Vitest patterns:
- `npm run test -- <filename>` - Run specific test file (e.g., `utils.test.ts`)
- `npm run test -- -t "<pattern>"` - Run tests matching pattern
- `npm run test -- --watch` - Watch mode for TDD

Playwright patterns:
- `npm run test:e2e -- <spec-file>` - Run specific E2E test file
- `npm run test:e2e -- -g "<test name>"` - Run tests matching name
- `npm run test:e2e -- --project=chromium` - Run on specific browser

## Code Style Guidelines

### Imports
- Use `import { Component } from 'library'` for named imports
- Use `import Library from 'library'` for default imports
- Internal imports use `@/*` alias: `import { Button } from '@/components/ui/button'`
- Group imports: external libs, then internal, then relative; sort alphabetically within groups
- Use `import type { X }` for type-only imports (tree-shaking)
```typescript
import { useState, useEffect } from 'react'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Clinic, Practitioner } from '@/lib/types'
```

### TypeScript & Types
- Strict TypeScript enabled - all code must be type-safe
- Export types from `src/lib/types.ts` when shared across modules
- Use Zod schemas for validation in `src/lib/schemas/`
- Type inference preferred over explicit typing when possible
- Interface for object shapes, type for unions/primitives
- Avoid `any` - use `unknown` or specific types
- Use readonly arrays for immutable data: `readonly string[]`
- Type guards follow pattern: `function isPractitioner(obj: unknown): obj is Practitioner`

### Naming Conventions
- Components: PascalCase (e.g., `PractitionerCard`, `AdminLayout`)
- Functions: camelCase (e.g., `validateClinic`, `cleanRouteSlug`)
- Variables/Constants: camelCase (e.g., `clinics`, `isLoading`)
- Files: kebab-case (e.g., `practitioner-card.tsx`, `file-utils.ts`)
- Types/Interfaces: PascalCase with descriptive names (e.g., `ClinicInput`, `Review`)

### Formatting
- No trailing whitespace
- Use 2-space indentation (or follow project .editorconfig)
- Maximum line length: 100 characters preferred
- Use `cn()` utility from `@/lib/utils` for conditional Tailwind classes
- Prefer `const` over `let`, use arrow functions for callbacks
- Follow shadcn/ui patterns with cva for component variants

### Component Patterns
- Client components start with `'use client'` directive at top of file
- Define props interfaces before component export, use `asChild` for composition
- Destructure props: `function Component({ prop1, prop2 }: Props)`
- Use semantic HTML (`<article>`, `<header>`, `<main>`, `<nav>`)
- Add `aria-label` for accessibility, use unique identifiers for keys
- Use `next/image` for optimized images (domains allowlisted in next.config.js)

### API Routes (Next.js App Router)
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Always use try-catch with error logging
- Return `NextResponse.json()` with appropriate status codes
- Validate input with Zod before processing, use async/await consistently

### Error Handling
- Log errors with context: `console.error('Failed to create clinic:', error)`
- Return error responses with 4xx/5xx status codes
- Use try-catch for all async operations
- Handle null/undefined gracefully with optional chaining

### State Management
- Use React hooks: `useState`, `useEffect`, `useRouter`
- Global state with Zustand stores in `src/app/stores/`
- Fetch data in `useEffect` with cleanup functions, show skeletons for loading

### File Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (grouped by feature/ui)
- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/lib/` - Utilities, types, schemas, helpers
- `src/lib/types.ts` - TypeScript interfaces for shared types
- `src/lib/schemas/` - Zod validation schemas per entity
- `src/test/setup.ts` - Vitest setup (@testing-library/jest-dom)
- `tests/e2e/` - Playwright end-to-end tests
- Admin features in `src/app/admin/` with API routes in `src/app/api/admin/`

### Tech Stack
- Next.js 14.2.25 (App Router) + React 18.2
- TypeScript 5.9 (strict mode), Tailwind CSS 4.1.9, Zustand
- Zod for validation, Shadcn/ui + Radix UI
- Vitest for unit tests, Playwright for E2E, Supabase backend

### Utility Functions
- `cn()` - Merge Tailwind classes intelligently
- `safeParse()` - Parse JSON safely with error handling
- `decodeUnicodeEscapes()` - Handle Unicode escape sequences
- `cleanRouteSlug()` - Clean and format URL slugs
- File operations in `@/lib/admin/file-utils`

### Validation
- All input data must be validated with Zod schemas
- Schemas in `src/lib/schemas/` matching entity names
- Validation helpers in `src/lib/admin/validators.ts`
- Return 400 with validation errors on invalid input
- Slug format: kebab-case with regex `/^[a-z0-9-]+$/`

### Accessibility
- Images must have alt text (use `alt=""` for decorative images)
- Buttons/links need text or aria-label
- Form inputs need labels or aria-label/placeholder
- Use semantic HTML for screen readers
- Test with Playwright accessibility tests in `tests/e2e/`

### File Operations
- Use `readJsonFile` and `writeJsonFile` from `@/lib/admin/file-utils`
- Handle Unicode escapes with `decodeUnicodeEscapes()`
- Parse data safely with `safeParse()` utility
- Data files: `clinics_processed_new_data.json`, etc. in data directory

### Project Configuration
- Base path: `/directory` (configured in next.config.js)
- Asset prefix: `/directory`
- Font families: Geist Sans (body), Geist Mono (code)
- Image formats: AVIF and WebP enabled
- Playwright tests: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Before Committing
1. Run `npm run lint` - fix all linting errors
2. Run `npm test` - ensure unit tests pass
3. Run `npm run build` - ensure production build succeeds
4. Review TypeScript errors in IDE
