# Icons Directory

This directory contains all custom SVG icons used in the Twin MS application, organized by category for better maintainability.

## Directory Structure

```
src/icons/
├── navigation/          # Navigation-related icons (sidebar, menu items)
│   ├── DashboardIcon.tsx
│   └── index.ts
├── actions/             # Action icons (buttons, controls)
├── status/              # Status indicators (alerts, health, etc.)
├── system/              # System-related icons (power, network, etc.)
└── index.ts             # Main barrel export
```

## Icon Component Template

When creating a new icon component, follow this template:

```tsx
interface IconNameProps {
  className?: string
  width?: number
  height?: number
  fill?: string
}

const IconName = ({
  className = '',
  width = 20,
  height = 20,
  fill = '#3BA091',
}: IconNameProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {/* SVG paths here */}
    </svg>
  )
}

export default IconName
```

## Usage

```tsx
// Import specific icon
import { DashboardIcon } from '@/icons'

// Use with custom props
;<DashboardIcon className='w-5 h-5' fill='currentColor' />
```

## Guidelines

1. **Consistent Props**: All icons should accept `className`, `width`, `height`, and `fill` props
2. **Default Values**: Use sensible defaults (20x20px, theme color)
3. **Naming Convention**: Use descriptive names ending with "Icon"
4. **Organization**: Place icons in appropriate category folders
5. **Export**: Always export from category index and main index files
6. **Fill Color**: Use `currentColor` for icons that should inherit text color, or specific colors for branded icons

## Current Icons

### Navigation

- **DashboardIcon**: 4-square grid pattern for statistics/dashboard pages
