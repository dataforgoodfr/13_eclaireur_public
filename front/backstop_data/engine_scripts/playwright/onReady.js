module.exports = async (page, scenario) => {
  console.log(`SCENARIO > ${scenario.label}`);
  
  try {
    // Wait for the page to load with a shorter timeout
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  } catch (error) {
    console.log('DOMContentLoaded timeout, continuing anyway...');
  }
  
  // Wait for Storybook to be ready
  try {
    await page.waitForSelector('[data-testid="storybook-preview-iframe"], .sb-show-main', { timeout: 10000 });
  } catch (error) {
    console.log('Storybook selector not found, continuing anyway...');
  }
  
  // Hide any animations or transitions that might cause flaky tests
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: -1ms !important;
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        background-attachment: initial !important;
        scroll-behavior: auto !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  // Wait a bit for any remaining animations to settle
  await page.waitForTimeout(1000);
};
