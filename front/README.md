# ÉCLAIREUR PUBLIC - Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

You can get started by installing the dependencies by running:

```bash
yarn install
```

Then run and watch the dev environment with:

```bash
yarn dev
```

For formatting the code using prettier run:

```bash
yarn format
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local environment variables
Create a .env.local file in the folder /front
add the following environment variables

```
POSTGRESQL_ADDON_HOST=
POSTGRESQL_ADDON_DB=
POSTGRESQL_ADDON_USER=
POSTGRESQL_ADDON_PORT=
POSTGRESQL_ADDON_PASSWORD=
POSTGRESQL_ADDON_URI=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Development Tools

### Storybook

Storybook is set up for component development and documentation.

#### Running Storybook
```bash
yarn run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

#### Building Storybook
```bash
yarn run storybook:build
```

#### Creating Stories
Stories are located alongside components with the `.stories.tsx` extension. Examples:
- `components/ui/button.stories.tsx`
- `components/SearchBar/SearchBar.stories.tsx`
- `app/components/HomePageHeader.stories.tsx`

### Visual Regression Testing with BackstopJS

BackstopJS is configured for visual regression testing of Storybook components using Playwright engine.

#### Running Visual Tests
```bash
# Build Storybook first
yarn storybook:build

# Start Storybook server
yarn storybook

# Generate initial reference images (first time only)
yarn backstop:reference

# Run visual regression tests
yarn backstop:test
```

#### Updating Baselines
When you intentionally change component visuals:
```bash
yarn backstop:approve
```

#### Viewing Test Reports
```bash
# Open the latest test report in browser
yarn backstop:report
```

#### GitHub Integration
When running in CI/CD:
- **Main branch**: Reports are automatically deployed to GitHub Pages at `https://[username].github.io/[repo-name]/backstop-reports/[run-number]/`
- **Pull Requests**: A comment is automatically added with a direct link to the visual regression report
- **Artifacts**: Reports and test results are uploaded as GitHub Actions artifacts for 30 days

#### Visual Test Results
- Reference images: `./backstop_data/bitmaps_reference/`
- Test screenshots: `./backstop_data/bitmaps_test/`
- HTML reports: `./backstop_data/html_report/`
- CI reports: `./backstop_data/ci_report/`

### End-to-End Testing with Playwright

Playwright is configured for E2E testing.

#### Running E2E Tests
```bash
# Run tests headlessly
yarn run test

# Run tests with UI
yarn run test:ui

# Run tests in headed mode
yarn run test:headed
```

#### Test Files
E2E tests are located in the `tests/` directory:
- `tests/homepage.spec.ts`

## Available Scripts

- `yarn run dev` - Start development server
- `yarn run build` - Build for production
- `yarn run start` - Start production server
- `yarn run lint` - Run ESLint
- `yarn run format` - Format code with Prettier
- `yarn run test` - Run Playwright tests
- `yarn run test:ui` - Run Playwright tests with UI
- `yarn run test:headed` - Run Playwright tests in headed mode
- `yarn run storybook` - Start Storybook development server
- `yarn run storybook:build` - Build Storybook for production
- `yarn run backstop:test` - Run visual regression tests
- `yarn run backstop:approve` - Update visual regression baselines
- `yarn run backstop:reference` - Generate initial reference images
- `yarn run backstop:report` - Open test results in browser

## Languages & Tools

- [Next.js](https://nextjs.org) - App rendering and routing
- [React](http://facebook.github.io/react) - Interactive UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Prettier](https://prettier.io/) - Code formatting
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Storybook](https://storybook.js.org/) - Component development and documentation
- [BackstopJS](https://github.com/garris/BackstopJS) - Visual regression testing
- [Playwright](https://playwright.dev/) - End-to-end testing
- [Bun](https://bun.sh/) - Package manager and runtime

## Project Structure

```
front/
├── .storybook/          # Storybook configuration
├── app/                 # Next.js app directory
├── components/          # Reusable components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── SearchBar/      # Search functionality
│   ├── Map/            # Map components
│   └── ...
├── tests/              # Playwright E2E tests
├── backstop_data/      # BackstopJS visual regression test data
├── public/             # Static assets
└── utils/              # Utility functions
```

## Testing Strategy

1. **Unit/Component Testing**: Storybook stories serve as component documentation and manual testing
2. **Visual Regression Testing**: BackstopJS automatically detects visual changes in components
3. **End-to-End Testing**: Playwright tests cover user workflows and integration scenarios

## Contributing

1. Create component stories for new components
2. Run visual regression tests before submitting PRs
3. Ensure E2E tests pass
4. Follow the established code formatting standards

## Languages & tools

- [Next.js](https://nextjs.org) is used app rendering and links.
- [React](http://facebook.github.io/react) is used for interactive UI.
- [Tailwind CSS](https://tailwindcss.com/) is used for styling
- [Prettier](https://prettier.io/) is used for formatting
- [shadcn](https://ui.shadcn.com/) is used for ui components
