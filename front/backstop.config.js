// Function to generate scenarios from Storybook stories
function generateStorybookScenarios() {
  const scenarios = [];
  
  // Base scenarios for common Storybook stories
  const commonStories = [
    'ui-button--default',
    'ui-button--secondary',
    'ui-button--destructive',
    'ui-button--outline',
    'ui-button--ghost',
    'ui-button--link',
    'components-searchbar--default',
    'components-searchbar--with-container',
    'components-navbar--default',
    'components-navbar--with-background',
    'components-navbar--mobile',
    'components-navbar--mobile-menu-open',
    'pages-homepageheader--default'
  ];

  for (const story of commonStories) {
    scenarios.push({
      label: story,
      url: `http://localhost:6006/iframe.html?id=${story}&viewMode=story`,
      delay: 2000,
      misMatchThreshold: 0.1,
      requireSameDimensions: true,
      readyTimeout: 30000
    });
  }

  return scenarios;
}

module.exports = {
  id: "eclaireur_public_visual_tests",
  viewports: [
    {
      label: "phone",
      width: 375,
      height: 667
    },
    {
      label: "tablet",
      width: 768,
      height: 1024
    },
    {
      label: "desktop",
      width: 1280,
      height: 800
    }
  ],
  onBeforeScript: "playwright/onBefore.js",
  onReadyScript: "playwright/onReady.js",
  scenarios: generateStorybookScenarios(),
  paths: {
    bitmaps_reference: "backstop_data/bitmaps_reference",
    bitmaps_test: "backstop_data/bitmaps_test",
    engine_scripts: "backstop_data/engine_scripts",
    html_report: "backstop_data/html_report",
    ci_report: "backstop_data/ci_report"
  },
  report: ["browser"],
  engine: "playwright",
  engineOptions: {
    args: ["--no-sandbox"]
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false
};
