# Converso - AI Teaching Platform Agent Documentation

## Project Overview

**Converso** is a real-time AI teaching platform built with Next.js 16 (App Router), featuring AI-powered learning companions, authentication via Clerk, and a modern, responsive UI.

### Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Authentication**: Clerk
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Fonts**: Bricolage Grotesque (Google Fonts)

---

## Project Structure

```
my-saas/
├── app/                          # Next.js App Router pages
│   ├── companion/                # Companion-related pages
│   │   ├── [id]/                 # Individual companion page
│   │   ├── new/                  # Create new companion
│   │   └── page.tsx              # Companions listing
│   ├── my-journey/               # User journey page
│   ├── sign-in/                  # Clerk sign-in page
│   ├── subscription/             # Subscription management
│   ├── layout.tsx                # Root layout with ClerkProvider
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   ├── CompanionList.tsx     # Table-based companion list
│   │   └── CTA.tsx               # Call-to-action section
│   ├── CompanionCard.tsx         # Companion card component
│   ├── CompanionForm.tsx         # Form for creating companions
│   ├── navbar.tsx                # Navigation with auth
│   └── NavItems.tsx              # Navigation items
├── constants/                    # App constants
│   └── index.ts                  # Subjects, colors, sessions data
├── types/                        # TypeScript type definitions
│   └── index.d.ts                # Global type definitions
├── lib/                          # Utility functions
│   └── utils.ts                  # Class name utilities
├── public/                       # Static assets
│   ├── images/                   # Images
│   └── icons/                    # Icons
├── middleware.ts                 # Clerk authentication middleware
└── .env.local                    # Environment variables (gitignored)
```

---

## Development Workflow

### 1. Setup & Installation

```bash
# Clone repository
git clone <repository-url>
cd my-saas

# Install dependencies
npm install

# Set up environment variables
# Create .env.local and add Clerk keys:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# Start development server
npm run dev
```

### 2. Development Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm build

# Start production server
npm start

# Lint code
npm run lint
```

### 3. Adding New Features

#### Adding a New Page

1. Create file in `app/` directory following App Router conventions
2. Use TypeScript and proper typing
3. Import necessary components from `components/`
4. Follow existing page structure patterns

Example:
```tsx
// app/new-page/page.tsx
import React from 'react'

const NewPage = () => {
  return (
    <main>
      <h1>New Page</h1>
      {/* Content */}
    </main>
  )
}

export default NewPage
```

#### Adding a New Component

1. Create component in `components/` or `components/ui/`
2. Use TypeScript interfaces for props
3. Follow existing naming conventions
4. Add to centralized types if needed

Example:
```tsx
// components/MyComponent.tsx
import React from 'react'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  )
}

export default MyComponent
```

#### Adding shadcn/ui Components

```bash
# Install a new shadcn component
npx shadcn@latest add <component-name>

# Example: Add dialog component
npx shadcn@latest add dialog
```

### 4. Styling Guidelines

#### CSS Architecture

- **Global Styles**: `app/globals.css`
- **Component Classes**: Use `@layer components` in globals.css
- **Utility Classes**: Use `@layer utilities` in globals.css
- **Tailwind**: Use Tailwind utility classes in components

#### Design System

**Colors:**
```css
--cta: #2c2c2c          /* CTA background */
--cta-gold: #fccc41     /* CTA accent */
--primary: oklch(...)   /* Primary color */
--background: oklch(...) /* Background */
--foreground: oklch(...) /* Text color */
```

**Border Radius:**
- `rounded-4xl`: 16px (primary border radius)
- `rounded-2xl`: 12px (secondary)
- `rounded-full`: Full circle

**Typography:**
- Font: Bricolage Grotesque
- Headings: Bold, various sizes (text-2xl, text-3xl)
- Body: text-base, text-xl

#### Component Styling Pattern

```tsx
// Use existing CSS classes
<div className="companion-card">
  <h3 className="companion-title">{name}</h3>
  <p className="companion-topic">{topic}</p>
</div>

// Or Tailwind utilities
<div className="flex items-center gap-4 p-4 rounded-2xl">
  {/* Content */}
</div>
```

---

## Authentication (Clerk)

### Setup

1. **Middleware** (`middleware.ts`):
   - Uses `clerkMiddleware()` from `@clerk/nextjs/server`
   - Protects all routes except static files
   - Always runs for API routes

2. **Layout** (`app/layout.tsx`):
   - Wrapped with `<ClerkProvider>`
   - Provides auth context to entire app

3. **Navbar** (`components/navbar.tsx`):
   - `<SignedOut>`: Shows Sign In/Sign Up buttons
   - `<SignedIn>`: Shows UserButton with profile menu

### Using Auth in Components

```tsx
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'

function MyComponent() {
  const { user } = useUser()
  
  return (
    <>
      <SignedIn>
        <p>Welcome, {user?.firstName}!</p>
      </SignedIn>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
    </>
  )
}
```

### Server-Side Auth

```tsx
import { auth } from '@clerk/nextjs/server'

export default async function ServerComponent() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Not authenticated</div>
  }
  
  return <div>User ID: {userId}</div>
}
```

---

## Data Management

### Constants (`constants/index.ts`)

Centralized data for:
- `subjects`: Available subjects array
- `subjectsColors`: Color mapping for subjects
- `voices`: Voice options for companions
- `recentSessions`: Sample companion sessions
- `completedLessons`: Sample completed lessons

### Types (`types/index.d.ts`)

Global TypeScript interfaces:
- `Subject`: Enum of available subjects
- `Companion`: Companion data structure
- `CompanionListItem`: List item structure
- `CompanionListProps`: Component props
- `CreateCompanion`: Form data structure

### Adding New Data

1. Add constants to `constants/index.ts`
2. Add types to `types/index.d.ts`
3. Export and use in components

Example:
```typescript
// constants/index.ts
export const newData = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
]

// types/index.d.ts
interface NewDataItem {
  id: string
  name: string
}
```

---

## Component Library

### Core Components

#### CompanionCard
**Purpose**: Display individual companion with details  
**Props**: `id`, `name`, `topic`, `subject`, `duration`, `color`  
**Features**: Clickable, bookmark button, launch lesson button

#### CompanionList
**Purpose**: Table-based list of companions  
**Props**: `title`, `companions[]`  
**Features**: Clickable rows, icons, subject badges, shadcn table

#### CTA (Call-to-Action)
**Purpose**: Marketing section with sign-up prompt  
**Features**: Badge, heading, description, buttons, image

#### Navbar
**Purpose**: Main navigation with auth  
**Features**: Logo, nav items, Clerk auth buttons

### UI Components (shadcn/ui)

- `Button`: Customizable button with variants
- `Input`: Form input field
- `Label`: Form label
- `Form`: Form wrapper with validation
- `Table`: Table components (Header, Body, Row, Cell)

---

## Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] User button displays after sign-in
- [ ] Profile menu accessible
- [ ] Sign out works correctly
- [ ] Auth state persists across refreshes

#### Navigation
- [ ] All nav links work
- [ ] Logo links to homepage
- [ ] Page transitions smooth
- [ ] Active states correct

#### Companion Features
- [ ] Companion cards display correctly
- [ ] Companion list shows all items
- [ ] Clickable rows navigate properly
- [ ] Icons and badges render
- [ ] Hover effects work

#### Responsive Design
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)
- [ ] No horizontal scroll
- [ ] Touch targets adequate

#### Forms
- [ ] Validation works
- [ ] Error messages display
- [ ] Submit functionality
- [ ] Loading states

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Testing

```bash
# Build for production
npm run build

# Check bundle size
# Review .next/analyze output

# Lighthouse audit
# Run in Chrome DevTools
```

---

## Deployment

### Environment Variables

Required for production:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

### Build Process

```bash
# 1. Install dependencies
npm install

# 2. Build application
npm run build

# 3. Start production server
npm start
```

### Deployment Platforms

**Vercel (Recommended)**:
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Other Platforms**:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

---

## Troubleshooting

### Common Issues

#### "Missing Publishable Key" Error
**Solution**: Add Clerk keys to `.env.local` and restart dev server

#### Tailwind Classes Not Working
**Solution**: Check `globals.css` imports and Tailwind config

#### Component Not Rendering
**Solution**: Check imports, verify component export, check console for errors

#### Build Errors
**Solution**: 
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Debug Mode

```bash
# Enable Next.js debug mode
NODE_OPTIONS='--inspect' npm run dev

# View detailed error messages
# Check browser console
# Check terminal output
```

---

## Code Quality

### TypeScript

- Always use TypeScript
- Define interfaces for props
- Avoid `any` type
- Use proper typing for functions

### ESLint

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Best Practices

1. **Component Organization**:
   - One component per file
   - Co-locate related components
   - Use barrel exports when appropriate

2. **State Management**:
   - Use React hooks (useState, useEffect)
   - Keep state close to where it's used
   - Lift state up when needed

3. **Performance**:
   - Use Next.js Image component
   - Lazy load components when appropriate
   - Minimize bundle size

4. **Accessibility**:
   - Use semantic HTML
   - Add ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers

---

## Git Workflow

### Branching Strategy

```bash
main          # Production-ready code
├── develop   # Development branch
└── feature/* # Feature branches
```

### Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Example:
```bash
git commit -m "feat(auth): add Clerk authentication"
git commit -m "fix(navbar): resolve mobile menu issue"
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Test locally
4. Push to remote
5. Create PR with description
6. Review and merge

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Design Resources
- [Lucide Icons](https://lucide.dev)
- [Google Fonts](https://fonts.google.com)
- [Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Clerk Discord](https://discord.gg/clerk)
- [GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## Maintenance

### Regular Tasks

**Weekly**:
- Review and merge PRs
- Update dependencies
- Check for security alerts

**Monthly**:
- Update Next.js and major dependencies
- Review and optimize bundle size
- Audit accessibility
- Performance testing

**Quarterly**:
- Major version updates
- Architecture review
- Security audit
- User feedback review

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update specific package
npm update <package-name>

# Update all packages (careful!)
npm update

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

---

## Contact & Support

For questions or issues:
1. Check this documentation
2. Review existing issues on GitHub
3. Consult official documentation
4. Reach out to the development team

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintainer**: Development Team
