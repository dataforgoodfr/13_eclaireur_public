module.exports = async (page, scenario) => {
  const hoverSelector = scenario.hoverSelectors || scenario.hoverSelector;
  const clickSelector = scenario.clickSelectors || scenario.clickSelector;
  const keyPressSelector = scenario.keyPressSelectors || scenario.keyPressSelector;
  const scrollToSelector = scenario.scrollToSelector;
  const postInteractionWait = scenario.postInteractionWait; // selector [str] | ms [int]

  if (keyPressSelector) {
    for (const keyPressSelectorItem of [].concat(keyPressSelector)) {
      await page.waitForSelector(keyPressSelectorItem.selector);
      await page.fill(keyPressSelectorItem.selector, keyPressSelectorItem.keyPress);
    }
  }

  if (hoverSelector) {
    for (const hoverSelectorIndex of [].concat(hoverSelector)) {
      await page.waitForSelector(hoverSelectorIndex);
      await page.hover(hoverSelectorIndex);
    }
  }

  if (clickSelector) {
    for (const clickSelectorIndex of [].concat(clickSelector)) {
      await page.waitForSelector(clickSelectorIndex);
      await page.click(clickSelectorIndex);
    }
  }

  if (scrollToSelector) {
    await page.waitForSelector(scrollToSelector);
    await page.evaluate((scrollToSelector) => {
      document.querySelector(scrollToSelector).scrollIntoView();
    }, scrollToSelector);
  }

  if (postInteractionWait) {
    if (typeof postInteractionWait === 'string') {
      await page.waitForSelector(postInteractionWait);
    } else {
      await page.waitForTimeout(postInteractionWait);
    }
  }
};
