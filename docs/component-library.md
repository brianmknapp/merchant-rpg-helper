# Component Library Setup

## Overview

This project uses **shadcn/ui**, a collection of beautifully designed, accessible components built on top of Radix UI and styled with Tailwind CSS.

## Already Installed

- `Button` – Basic button component with variants
- `Select` – Dropdown select component
- `Label` – Form label component
- `Card` – Container component with header, content, footer sections

## Workflow

### Add a New Component

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add input
```

### Browse Available Components

Visit [ui.shadcn.com](https://ui.shadcn.com/docs/components) to see all available components and their documentation.

## Design System

shadcn/ui uses CSS variables for theming. Light/dark mode is configured via Tailwind's `dark:` prefix.

### Tailwind Configuration

- Configured in `tailwind.config.ts`
- CSS variables in `app/globals.css`
- Preset: **Nova** (modern, clean design)

### Adding Custom Colors/Variables

Edit `lib/utils.ts` or `.globals.css` to customize the design system.

## Best Practices

1. **Import from `@/components/ui/`** – Keeps component imports clean and organized.
2. **Use TypeScript** – Components are fully typed.
3. **Compose components** – Chain shadcn/ui elements for complex UIs.
4. **Respect the theme** – Use semantic color tokens like `foreground`, `muted-foreground`, `input`, `border`.

## Phase 2+ Component Needs

For the full combat simulator, consider adding:
- `Tabs` – To toggle between different views
- `Dialog` / `AlertDialog` – For modals and confirmations
- `Table` – To display combat logs
- `Progress` – For health bars
- `Input` – For future configuration inputs

