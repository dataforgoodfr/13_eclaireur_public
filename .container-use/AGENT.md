## Navigation Bar Fixes

### Changes Made:
1. **Desktop/Mobile Logo Separation**: Updated Navbar to use different logos for desktop and mobile views
   - Desktop: `/eclaireur/logo-navmenu-desktop.png` (hidden on mobile)
   - Mobile Icon (left): `/eclaireur/logo-navmenu-mobile-1.png` 
   - Mobile Text (centered): `/eclaireur/logo-navmenu-mobile-2.png`

2. **Mobile Menu Auto-Close Fix**: Modified MobileMenu component to:
   - Import SearchBar directly instead of SearchCommunity wrapper
   - Add navigation handler that closes menu after search selection
   - Properly handle router navigation with menu state management

### Files Modified:
- `/workdir/front/app/components/Navbar/index.tsx` - Updated logo structure for desktop/mobile
- `/workdir/front/app/components/Navbar/MobileMenu.tsx` - Fixed auto-close on search selection

### Placeholder Files Created:
- `/workdir/front/public/eclaireur/logo-navmenu-desktop.png` (empty - needs actual logo)
- `/workdir/front/public/eclaireur/logo-navmenu-mobile-1.png` (empty - needs actual icon)
- `/workdir/front/public/eclaireur/logo-navmenu-mobile-2.png` (empty - needs actual text)

### To Test:
Run `cd /workdir/front && yarn dev` to start the development server