# Twin MS - Control Room Dashboard

A modern, responsive control room dashboard built with React, TypeScript, and Tailwind CSS for real estate data management and monitoring.

## 🚀 Features

- **Modern Dashboard Layout**: Clean sidebar navigation with collapsible design
- **Real-time Monitoring**: Statistics, alerts, and system status monitoring
- **3D Model Control**: Interactive 3D model controls and viewport
- **System Management**: Power management and network status controls
- **Camera Feed**: Multi-camera monitoring with live feeds
- **Dark Theme**: Professional dark theme optimized for control rooms
- **Responsive Design**: Works seamlessly across desktop and tablet devices

## 🎨 Design System

### Typography

- **System Title**: IBM Plex Sans font
- **Navigation**: Inter font
- **Page Titles**: Roboto font
- **Content**: Inter font

### Color Scheme

- **Primary Background**: `rgba(3, 7, 18, 1)` - Deep navy for optimal viewing
- **Sidebar**: Linear gradient from gray-800 to gray-700 with transparency
- **App Bar**: Horizontal gradient with backdrop blur and shadow effects
- **Borders**: Semi-transparent gray borders for subtle separation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Sidebar.tsx      # Navigation sidebar
│   └── AppBar.tsx       # Top application bar
├── pages/               # Page components
│   ├── Statistics.tsx   # Dashboard statistics
│   ├── Model3DControl.tsx # 3D model controls
│   ├── SystemControl.tsx # System management
│   ├── AlertsMaintenance.tsx # Alerts and maintenance
│   └── CameraFeed.tsx   # Camera monitoring
├── hooks/               # Custom React hooks
├── App.tsx             # Root application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## 🏗️ Architecture

### Component Architecture

- **Layout Component**: Manages sidebar state and main content area
- **Sidebar**: Collapsible navigation with active page highlighting
- **AppBar**: Context-aware header with page title and controls
- **Page Components**: Individual views for each functional area

### State Management

- React hooks for local component state
- TypeScript for type safety and better developer experience
- Modular page system for easy feature additions

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Extended Tailwind config for brand colors
- **Google Fonts**: IBM Plex Sans, Inter, and Roboto integration
- **Responsive Grid**: CSS Grid and Flexbox for layouts

## 🔧 Customization

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the page type to `PageType` in `App.tsx`
3. Add navigation item to `menuItems` in `Sidebar.tsx`
4. Update the page renderer in `App.tsx`

### Styling Modifications

- Colors: Update `tailwind.config.js` theme extensions
- Fonts: Modify font imports in `src/index.css`
- Components: Use Tailwind utilities for consistent styling

## 📋 Requirements Implemented

✅ Sidebar navigation with logo and system name  
✅ Collapsible sidebar that pushes main content  
✅ Five main pages: Statistics, 3D Model Control, System Control, Alerts & Maintenance, Camera Feed  
✅ App bar with page title and control dropdowns  
✅ Device and zone dropdowns (All Devices, All Zones)  
✅ Refresh Status button  
✅ Custom color scheme with gradients and transparency  
✅ Typography system with specified fonts  
✅ Clean, reusable component architecture

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This project is proprietary software for Twin MS control room operations.
