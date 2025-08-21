# Copilot Instructions for Theme Builder

## Project Overview

This is the **Theme Builder** for the Deutsche Bahn UX Design System - a React-based web application that helps users create, customize, and export themes with proper color palettes, typography, and design tokens.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + SCSS
- **State Management**: Zustand
- **UI Components**: DB UX React Core Components (@db-ux/react-core-components)
- **Design Tokens**: DB UX Core Foundations (@db-ux/core-foundations)
- **Color Processing**: Chroma.js, HSLUV, APCA-W3 (for contrast calculations)
- **Build System**: Vite with TypeScript
- **Code Quality**: ESLint, Prettier, Husky (pre-commit hooks)
- **Internationalization**: i18next

## Architecture & Key Concepts

### Core Features
1. **Theme Customization**: Users can create custom themes with brand colors, neutral colors, and additional colors
2. **Light/Dark Mode Support**: Automatic generation of light and dark variants with proper contrast
3. **Color Accessibility**: WCAG-compliant contrast ratio calculations using APCA-W3
4. **Live Preview**: Real-time preview of components with the customized theme
5. **Export Capabilities**: Generate CSS custom properties, design tokens, and theme files
6. **Multi-format Output**: Support for Style Dictionary, CSS, and various design token formats

### Key Directories Structure
```
src/
├── components/         # Reusable UI components
│   ├── Customization/ # Theme customization interface
│   ├── Demo/          # Live preview components
│   ├── Editor/        # Code editor components
│   └── Playground/    # Interactive playground
├── pages/             # Application pages/routes
├── store/             # Zustand state management
├── utils/             # Utility functions and helpers
│   ├── colors/        # Color processing and generation
│   ├── outputs/       # Export functionality (CSS, Style Dictionary)
│   └── data.ts        # Type definitions and data structures
└── data/              # Static data and configuration
```

### State Management (Zustand)
- **Theme State**: Current theme configuration (colors, typography, etc.)
- **UI State**: Application state (current page, notifications, etc.)
- **Color State**: Generated color palettes and variants

### Color System
- **Origin Colors**: Base brand colors that generate all other variants
- **On-Colors**: Text/foreground colors with proper contrast against backgrounds
- **Luminance Steps**: Systematic color scale generation for accessibility
- **Contrast Calculation**: APCA-W3 based contrast ratios for WCAG compliance

## Development Guidelines

### Code Style & Conventions
- Follow TypeScript strict mode
- Use functional components with hooks
- Prefer arrow functions for component definitions
- Use meaningful component and variable names
- Follow the existing file and folder naming conventions
- Keep components small and focused on single responsibility

### Color Processing Best Practices
- Always validate color contrast ratios when generating color variants
- Use `generateColorsByOrigin()` for systematic color palette generation
- Ensure on-colors are automatically recalculated when origin colors change
- Test color combinations in both light and dark modes
- Consider accessibility (WCAG AA/AAA compliance)

### State Management Patterns
- Use Zustand store for global state
- Keep component state local when possible
- Use derived state for computed values
- Minimize state mutations and prefer immutable updates

### Component Development
- Use DB UX React Core Components as the foundation
- Ensure components work in both light and dark themes
- Add proper TypeScript types for all props and state
- Include proper error handling and loading states
- Test components with various color combinations

### Performance Considerations
- Debounce color calculations for real-time updates
- Optimize re-renders with proper dependency arrays
- Use React.memo for expensive components
- Lazy load heavy components when possible

## Testing & Quality Assurance

### Before Committing
1. Run linting: `npm run lint`
2. Test build: `npm run build`
3. Verify functionality in both light and dark modes
4. Test with various color combinations
5. Check contrast ratios meet accessibility standards

### Key Areas to Test
- Color palette generation and variants
- Light/dark mode switching
- On-color automatic recalculation
- Export functionality
- Component previews
- Accessibility compliance

## Common Tasks & Patterns

### Adding New Color Features
1. Update type definitions in `src/utils/data.ts`
2. Implement color generation logic in `src/utils/colors/`
3. Update store state and actions
4. Add UI components for color picker/editor
5. Ensure proper contrast calculations
6. Test in both light and dark modes

### Fixing Color Issues
- Check contrast ratios first
- Verify color generation algorithms
- Ensure on-colors are recalculated properly
- Test edge cases (very light/dark colors)
- Validate WCAG compliance

### Working with Style Dictionary
- Output configurations are in `src/utils/outputs/style-dictionary/`
- Color transformations in `src/utils/outputs/style-dictionary/colors.ts`
- Test exports with various theme configurations

## Bug Reporting & Issues

When reporting bugs or working on issues:
- Include screenshots for visual issues
- Specify light/dark mode context
- Provide color values that reproduce the issue
- Test contrast ratios if accessibility-related
- Include browser and device information

## Dependencies & Updates

### Key Dependencies to Watch
- `@db-ux/react-core-components`: Core UI components
- `@db-ux/core-foundations`: Design tokens and foundations
- `chroma-js`: Color manipulation
- `apca-w3`: Contrast calculations
- `style-dictionary`: Design token transformation

### Update Guidelines
- Test thoroughly with existing themes when updating color libraries
- Verify contrast calculations remain accurate
- Check export functionality after Style Dictionary updates
- Ensure DB UX component compatibility

## Internationalization

- Use i18next for all user-facing text
- Add translation keys to appropriate namespace files
- Support for multiple languages (German, English)
- Test UI layout with longer translated strings

This project prioritizes accessibility, color science accuracy, and seamless integration with the Deutsche Bahn design system. Always consider the impact of changes on color accessibility and WCAG compliance.