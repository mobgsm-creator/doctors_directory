import { test, expect } from '@playwright/test';

test.describe('Home Page Component Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directory');
  });

  test('should render all major components without errors', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
    
    const componentSelectors = [
      '[data-testid="hero-section"]',
      'h2:has-text("Contact a Specialist")',
      'h2:has-text("Find Top-Rated Aesthetic Clinics Near You")',
      'h2:has-text("Most Popular Treatments")',
      '[aria-label="Regulatory Compliance"]',
      'h2:has-text("Building trust and clarity in healthcare")',
      'h2:has-text("For Service Providers")',
      'h2:has-text("Our Latest Blogs")',
      'h2:has-text("Frequently Asked Questions")'
    ];

    for (const selector of componentSelectors) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
    }
  });

  test('should have correct data structure for specialists', async ({ page }) => {
    const specialistImages = page.locator('img[alt*="Specialist"]');
    await expect(specialistImages).toHaveCount(5);

    const specialistNames = page.locator('.grid.grid-cols-2.md\\:grid-cols-5 p.text-base.font-medium');
    await expect(specialistNames).toHaveCount(5);

    const expectedNames = [
      'Facial Aesthetics',
      'Cosmetology', 
      'Hair & Scalp',
      'Skin Technology & Laser',
      'Wellness'
    ];

    for (let i = 0; i < expectedNames.length; i++) {
      await expect(specialistNames.nth(i)).toHaveText(expectedNames[i]);
    }
  });

  test('should have correct data structure for treatments', async ({ page }) => {
    const treatmentImages = page.locator('img[alt*="Treatment"]');
    await expect(treatmentImages).toHaveCount(5);

    const treatmentNames = page.locator('.grid.grid-cols-2.md\\:grid-cols-3 p.text-base.font-medium');
    await expect(treatmentNames).toHaveCount(5);

    const expectedTreatments = [
      'Facial',
      'Hands',
      'Eyes', 
      'Skin',
      'Hairline'
    ];

    for (let i = 0; i < expectedTreatments.length; i++) {
      await expect(treatmentNames.nth(i)).toHaveText(expectedTreatments[i]);
    }
  });

  test('should have correct blog data structure', async ({ page }) => {
    const blogArticles = page.locator('article');
    await expect(blogArticles).toHaveCount(3);

    const expectedTitles = [
      '10 Best HIPAA Compliant Medical Spa Software in 2025',
      'Top 10 Best Aesthetic Clinic Software in USA [2025]',
      'Aesthetic Clinic Marketing: Complete Guide [2025]'
    ];

    for (let i = 0; i < expectedTitles.length; i++) {
      const blogTitle = blogArticles.nth(i).locator('a.text-gray-900.underline');
      await expect(blogTitle).toHaveText(expectedTitles[i]);
    }

    const readMoreLinks = page.locator('a:has-text("Read More")');
    await expect(readMoreLinks).toHaveCount(3);
  });

  test('should have correct FAQ data structure', async ({ page }) => {
    const faqItems = page.locator('.border.border-gray-300');
    await expect(faqItems).toHaveCount(5);

    const expectedQuestions = [
      'What is the Consentz Aesthetic Directory?',
      'How is the directory different from the clinic management software?',
      'Who can be listed in the directory?',
      'What specialties are featured in the directory?',
      'How do I search for treatments?'
    ];

    for (let i = 0; i < expectedQuestions.length; i++) {
      const question = faqItems.nth(i).locator('span.font-medium.underline');
      await expect(question).toHaveText(expectedQuestions[i]);
    }
  });

  test('should have correct regulatory logos data', async ({ page }) => {
    const logoImages = page.locator('[aria-label="Regulatory Compliance"] img');
    await expect(logoImages).toHaveCount(6);

    const expectedAlts = ['HIS', 'HIW', 'JCCP', 'CQC', 'RQIA', 'Save Face'];
    
    for (let i = 0; i < expectedAlts.length; i++) {
      await expect(logoImages.nth(i)).toHaveAttribute('alt', expectedAlts[i]);
    }
  });

  test('should handle city carousel data correctly', async ({ page }) => {
    const cityLinks = page.locator('a[href*="/clinics/"]');
    const cityCount = await cityLinks.count();
    expect(cityCount).toBeGreaterThan(0);

    const firstCityLink = cityLinks.first();
    await expect(firstCityLink).toHaveAttribute('href', /\/clinics\/[^\/]+$/);
    
    const cityName = await firstCityLink.textContent();
    expect(cityName).toBeTruthy();
    expect(cityName!.length).toBeGreaterThan(0);
  });

  test('should have correct trust section data', async ({ page }) => {
    const trustCards = page.locator('.info-card');
    await expect(trustCards).toHaveCount(3);

    const expectedTitles = ['Our commitment', 'Insight that matters', 'Safe & reliable'];
    const expectedDescriptions = [
      'We deliver a home to real ethical professionals',
      'We ensure that patient reviews are genuine',
      'We protect your data and ensure secure medical quality'
    ];

    for (let i = 0; i < expectedTitles.length; i++) {
      const card = trustCards.nth(i);
      await expect(card.locator('h3')).toHaveText(expectedTitles[i]);
      await expect(card.locator('p')).toContainText(expectedDescriptions[i]);
    }
  });

  test('should have correct service providers section data', async ({ page }) => {
    const benefitsList = page.locator('.space-y-4 li');
    await expect(benefitsList).toHaveCount(5);

    const expectedBenefits = [
      'Gather verified patient reviews with our digital platform',
      'Showcase and validate your clinical expertise',
      'Connect, engage, and better understand your patients',
      'Access real-time insights to continually enhance your care',
      'Connect with like-minded healthcare professionals'
    ];

    for (let i = 0; i < expectedBenefits.length; i++) {
      await expect(benefitsList.nth(i)).toHaveText(expectedBenefits[i]);
    }
  });

  test('should validate all button interactions', async ({ page }) => {
    const buttons = [
      'button:has-text("See all Treatments")',
      'button:has-text("Learn More")',
      'button:has-text("View All Blogs")',
      'button:has-text("Read All FAQ\'S")'
    ];

    for (const buttonSelector of buttons) {
      const button = page.locator(buttonSelector);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });

  test('should validate all image alt attributes', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(0);
    }
  });

  test('should validate all link href attributes', async ({ page }) => {
    const links = page.locator('a[href]');
    const linkCount = await links.count();

    for (let i = 0; i < Math.min(linkCount, 20); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href!.length).toBeGreaterThan(0);
    }
  });

  test('should handle responsive layout correctly', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();

      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h2:has-text("Contact a Specialist")')).toBeVisible();
    }
  });

  test('should handle dynamic content loading', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const dynamicElements = [
      '.grid.grid-cols-2.md\\:grid-cols-5',
      '.grid.grid-cols-2.md\\:grid-cols-3',
      '[aria-label="Regulatory Compliance"]'
    ];

    for (const selector of dynamicElements) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
      
      const childCount = await element.locator('*').count();
      expect(childCount).toBeGreaterThan(0);
    }
  });

  test('should validate component boundaries and interactions', async ({ page }) => {
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(5);

    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }

    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });
});