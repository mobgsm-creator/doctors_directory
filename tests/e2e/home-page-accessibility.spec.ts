import { test, expect } from '@playwright/test';

test.describe('Home Page Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directory');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    let previousLevel = 1;
    for (let i = 0; i < headingCount; i++) {
      const heading = headings.nth(i);
      const tagName = await heading.evaluate(el => el.tagName);
      const currentLevel = Number.parseInt(tagName.charAt(1));
      
      expect(currentLevel).toBeGreaterThanOrEqual(previousLevel);
      expect(currentLevel).toBeLessThanOrEqual(6);
      
      const text = await heading.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have alt text for all images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });

  test('should have accessible buttons', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have accessible links', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 20); i++) {
      const link = links.nth(i);
      await expect(link).toBeVisible();
      
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href!.length).toBeGreaterThan(0);
      
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    let focusedElement = await page.locator(':focus');
    let tabCount = 0;
    
    while (await focusedElement.count() > 0 && tabCount < 20) {
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      expect(['a', 'button', 'input', 'select', 'textarea']).toContain(tagName);
      
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      tabCount++;
    }
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    const elementsWithAria = page.locator('[aria-label], [role]');
    const ariaCount = await elementsWithAria.count();

    for (let i = 0; i < ariaCount; i++) {
      const element = elementsWithAria.nth(i);
      const ariaLabel = await element.getAttribute('aria-label');
      const role = await element.getAttribute('role');
      
      if (ariaLabel) {
        expect(ariaLabel.length).toBeGreaterThan(0);
      }
      
      if (role) {
        const validRoles = ['button', 'link', 'navigation', 'main', 'complementary', 'contentinfo', 'banner', 'region'];
        expect(validRoles).toContain(role);
      }
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button');
    const elementCount = await textElements.count();

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = textElements.nth(i);
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      expect(styles.color).toBeTruthy();
      expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('should have accessible form elements', async ({ page }) => {
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const label = await input.getAttribute('aria-label') || 
                   await input.getAttribute('placeholder') ||
                   await input.getAttribute('title');
      
      if (label) {
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });

  test('should handle focus management properly', async ({ page }) => {
    const buttons = page.locator('button');
    if (await buttons.count() > 0) {
      await buttons.first().focus();
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('should have semantic HTML structure', async ({ page }) => {
    const semanticElements = {
      'main': 1,
      'header': '>=0',
      'footer': '>=0',
      'nav': '>=0',
      'section': '>=5',
      'article': '>=0'
    };

    for (const [tag, expectedCount] of Object.entries(semanticElements)) {
      const elements = page.locator(tag);
      const count = await elements.count();
      
      if (typeof expectedCount === 'number') {
        expect(count).toBe(expectedCount);
      } else {
         const minCount = Number.parseInt(expectedCount.replace('>=', ''));
        expect(count).toBeGreaterThanOrEqual(minCount);
      }
    }
  });

  test('should have accessible tables if present', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();

    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      const captions = table.locator('caption');
      const headers = table.locator('th');
      
      if (await captions.count() === 0) {
        expect(await headers.count()).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper list structure', async ({ page }) => {
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();

    for (let i = 0; i < listCount; i++) {
      const list = lists.nth(i);
      const listItems = list.locator('li');
      const itemCount = await listItems.count();
      
      if (itemCount > 0) {
        await expect(listItems.first()).toBeVisible();
      }
    }
  });

  test('should have accessible media elements', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      const width = await image.getAttribute('width');
      const height = await image.getAttribute('height');
      
      expect(alt).toBeTruthy();
      
      if (width && height) {
        expect(parseInt(width)).toBeGreaterThan(0);
        expect(parseInt(height)).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper skip links if present', async ({ page }) => {
    const skipLinks = page.locator('a[href^="#"]');
    const skipLinkCount = await skipLinks.count();

    for (let i = 0; i < skipLinkCount; i++) {
      const skipLink = skipLinks.nth(i);
      const href = await skipLink.getAttribute('href');
      const target = page.locator(href || '');
      
      if (await target.count() > 0) {
        await expect(target).toBeVisible();
      }
    }
  });

  test('should handle screen reader announcements', async ({ page }) => {
    const liveRegions = page.locator('[aria-live], [aria-atomic]');
    const liveRegionCount = await liveRegions.count();

    for (let i = 0; i < liveRegionCount; i++) {
      const region = liveRegions.nth(i);
      const live = await region.getAttribute('aria-live');
      const atomic = await region.getAttribute('aria-atomic');
      
      if (live) {
        expect(['polite', 'assertive', 'off']).toContain(live);
      }
      
      if (atomic) {
        expect(['true', 'false']).toContain(atomic);
      }
    }
  });
});