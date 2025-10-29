# SPEC Platform - Code Architecture Preview

## 🏗️ Project Structure

This preview demonstrates the core architecture of the SPEC platform - a TikTok-style discovery feed for automotive builds.

### Design System
**Location:** `src/index.css` & `tailwind.config.ts`

The entire design follows an automotive performance aesthetic:
- **Racing Orange/Red Primary**: High-energy performance color (`--primary: 14 100% 57%`)
- **Electric Blue Accent**: Tech-forward accent color (`--accent: 200 100% 50%`)
- **Carbon Black Background**: Deep, sophisticated dark theme (`--background: 0 0% 7%`)
- **Verified Gold**: Premium verified shop badge (`--verified: 45 100% 50%`)

All colors are semantic tokens defined in CSS variables, ensuring consistency across the platform.

### Component Architecture

#### 1. **BuildCard Component** (`src/components/BuildCard.tsx`)
The core of the TikTok-style feed experience.

**Features:**
- Full-screen vertical scrolling cards
- Horizontal stage navigation (Before → During → After)
- Performance stats display (HP, Torque, 0-60, 1/4 mile)
- Engagement actions (Like, Comment, Save, Quote, Share)
- Verified shop badges
- Real-time state management for interactions

**Key Design Patterns:**
- Stage carousel with dot indicators
- Gradient overlays for text readability
- Glassmorphic UI elements (backdrop-blur)
- Responsive action buttons with glow effects

#### 2. **TopBar Component** (`src/components/TopBar.tsx`)
Fixed navigation header with feed filtering.

**Features:**
- SPEC logo with gradient text
- Feed selector (For You, Verified, Following)
- Search and notifications
- Glassmorphic background

#### 3. **BottomNavigation Component** (`src/components/BottomNavigation.tsx`)
Mobile-first bottom navigation.

**Features:**
- Feed, Events, Clubs, Profile navigation
- Active state highlighting
- Icon + label design

### Page Structure

#### **Index Page** (`src/pages/Index.tsx`)
Main feed implementation with:
- Snap-scroll container for TikTok-style UX
- Mock build data demonstrating the data structure
- Three example builds showcasing different shop types

## 🎨 Design Philosophy

### Semantic Token Usage
Every color, gradient, and shadow is defined in the design system:
```css
/* Never use direct colors like this: */
className="text-white bg-black"

/* Always use semantic tokens: */
className="text-foreground bg-background"
```

### Gradient System
Three signature gradients:
- `gradient-performance`: Racing orange to yellow
- `gradient-carbon`: Subtle dark gradients
- `gradient-electric`: Blue tech gradients

### Shadow System
Performance-focused glows:
- `shadow-glow-primary`: Orange/red performance glow
- `shadow-glow-accent`: Electric blue glow
- `shadow-elevated`: Depth shadows

## 📊 Data Structure (from Master Plan)

### Build Object
```typescript
{
  id: string;
  shopName: string;
  shopVerified: boolean;
  carModel: string;
  buildTitle: string;
  stages: BuildStage[];
  stats: PerformanceStats;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}
```

### Build Stage
```typescript
{
  id: string;
  title: "Stock" | "Installation" | "Complete";
  image: string;
  description: string;
}
```

### Performance Stats
```typescript
{
  horsepower: number;
  torque: number;
  zeroToSixty: number;
  quarterMile: number;
}
```

## 🚀 Next Implementation Phases

### Phase 1: Core Features (Current Preview)
✅ TikTok-style vertical feed
✅ Build stage carousel
✅ Performance stats display
✅ Engagement controls
✅ Navigation structure

### Phase 2: Backend Integration
- [ ] Lovable Cloud (Supabase) setup
- [ ] Build data tables
- [ ] User authentication
- [ ] Shop verification system
- [ ] Real-time engagement tracking

### Phase 3: Advanced Features
- [ ] Video upload and playback
- [ ] Draw-on annotation tools
- [ ] Quote request system
- [ ] Comments and messaging
- [ ] Events and clubs

### Phase 4: Monetization
- [ ] Stripe Connect integration
- [ ] Promoted posts
- [ ] Shop subscriptions
- [ ] Payment processing

## 🎯 Key Technical Decisions

### Why This Architecture?

1. **Semantic Design System**: All styles in one place, easy to maintain and scale
2. **Component-Based**: Modular, reusable components
3. **Mobile-First**: Snap scrolling, touch-friendly UI
4. **Performance-Focused**: Optimized images, lazy loading ready
5. **Type-Safe**: Full TypeScript implementation

### Best Practices Implemented

✅ No inline color values
✅ Consistent spacing and sizing
✅ Accessible touch targets (48px minimum)
✅ Semantic HTML structure
✅ Responsive design principles
✅ State management patterns

## 📱 User Experience Flow

1. **Discovery**: User opens app → sees vertical feed
2. **Exploration**: Swipe up/down between builds
3. **Deep Dive**: Swipe left/right through build stages
4. **Engagement**: Like, comment, save, request quote
5. **Navigation**: Switch between Feed, Events, Clubs, Profile

## 🔧 Development Notes

### Running the Project
```bash
npm install
npm run dev
```

### Adding New Builds
Edit `src/pages/Index.tsx` and add to the `mockBuilds` array.

### Customizing Design
All design tokens are in:
- `src/index.css` (CSS variables)
- `tailwind.config.ts` (Tailwind extensions)

### Performance Optimization
- Images use Unsplash with width/quality parameters
- Components use React best practices
- Ready for lazy loading implementation
- Snap scrolling for smooth UX

---

**This is a preview/prototype demonstrating the core architecture, design system, and component structure of the SPEC platform based on the master plan.**
