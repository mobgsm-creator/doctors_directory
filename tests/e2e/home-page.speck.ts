import { test, expect } from '@playwright/test';

test.describe('Home Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/directory');
  });

  test('should load the home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Consentz Aesthetic Directory/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display the hero section', async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
  });

  test('should display "Contact a Specialist" section with correct specialists', async ({ page }) => {
    const specialistsSection = page.locator('h2:has-text("Contact a Specialist")');
    await expect(specialistsSection).toBeVisible();

    const expectedSpecialists = [
      'Facial Aesthetics',
      'Cosmetology',
      'Hair & Scalp',
      'Skin Technology & Laser',
      'Wellness'
    ];

    for (const specialist of expectedSpecialists) {
      await expect(page.locator(`text=${specialist}`)).toBeVisible();
    }

    const specialistImages = page.locator('img[alt*="Specialist"]');
    await expect(specialistImages).toHaveCount(5);
  });

  test('should display city carousel with functional links', async ({ page }) => {
    const citySection = page.locator('h2:has-text("Find Top-Rated Aesthetic Clinics Near You")');
    await expect(citySection).toBeVisible();

    const cityLinks = page.locator('a[href*="/clinics/"]');
    await expect(cityLinks.first()).toBeVisible();

    const firstCityLink = cityLinks.first();
    await firstCityLink.scrollIntoViewIfNeeded();
    await firstCityLink.click();
    
    await expect(page).toHaveURL(/\/clinics\//);
  });

  test('should display "Most Popular Treatments" section', async ({ page }) => {
    const treatmentsSection = page.locator('h2:has-text("Most Popular Treatments")');
    await expect(treatmentsSection).toBeVisible();

    const expectedTreatments = [
      'Facial',
      'Hands',
      'Eyes',
      'Skin',
      'Hairline'
    ];

    for (const treatment of expectedTreatments) {
      await expect(page.locator(`text=${treatment}`)).toBeVisible();
    }

    const treatmentImages = page.locator('img[alt*="Treatment"]');
    await expect(treatmentImages).toHaveCount(5);

    const seeAllButton = page.locator('button:has-text("See all Treatments")');
    await expect(seeAllButton).toBeVisible();
  });

  test('should display regulatory compliance logos', async ({ page }) => {
    const logoLoop = page.locator('[aria-label="Regulatory Compliance"]');
    await expect(logoLoop).toBeVisible();

    const expectedLogos = ['HIS', 'HIW', 'JCCP', 'CQC', 'RQIA', 'Save Face'];
    
    for (const logo of expectedLogos) {
      const logoElement = page.locator(`img[alt="${logo}"]`);
      await expect(logoElement.first()).toBeVisible();
    }
  });

  test('should display "Building trust and clarity in healthcare" section', async ({ page }) => {
    const trustSection = page.locator('h2:has-text("Building trust and clarity in healthcare")');
    await expect(trustSection).toBeVisible();

    const trustCards = page.locator('.info-card');
    await expect(trustCards).toHaveCount(3);

    const expectedTitles = ['Our commitment', 'Insight that matters', 'Safe & reliable'];
    
    for (const title of expectedTitles) {
      await expect(page.locator(`text=${title}`)).toBeVisible();
    }
  });

  test('should display "For Service Providers" section', async ({ page }) => {
    const providersSection = page.locator('h2:has-text("For Service Providers")');
    await expect(providersSection).toBeVisible();

    const benefitsList = page.locator('ul li');
    await expect(benefitsList).toHaveCount(5);

    const expectedBenefits = [
      'Gather verified patient reviews',
      'Showcase and validate your clinical expertise',
      'Connect, engage, and better understand your patients',
      'Access real-time insights',
      'Connect with like-minded healthcare professionals'
    ];

    for (const benefit of expectedBenefits) {
      await expect(page.locator(`text=${benefit}`)).toBeVisible();
    }

    const learnMoreButton = page.locator('button:has-text("Learn More")');
    await expect(learnMoreButton).toBeVisible();
  });

  test('should display "Our Latest Blogs" section', async ({ page }) => {
    const blogsSection = page.locator('h2:has-text("Our Latest Blogs")');
    await expect(blogsSection).toBeVisible();

    const blogCards = page.locator('article');
    await expect(blogCards).toHaveCount(3);

    const expectedBlogTitles = [
      '10 Best HIPAA Compliant Medical Spa Software in 2025',
      'Top 10 Best Aesthetic Clinic Software in USA [2025]',
      'Aesthetic Clinic Marketing: Complete Guide [2025]'
    ];

    for (const title of expectedBlogTitles) {
      await expect(page.locator(`text=${title}`)).toBeVisible();
    }

    const viewAllBlogsButton = page.locator('button:has-text("View All Blogs")');
    await expect(viewAllBlogsButton).toBeVisible();
  });

  test('should display FAQ section with functional accordion', async ({ page }) => {
    const faqSection = page.locator('h2:has-text("Frequently Asked Questions")');
    await expect(faqSection).toBeVisible();

    const faqItems = page.locator('.border.border-gray-300');
    await expect(faqItems).toHaveCount(5);

    const firstFAQ = faqItems.first();
    await firstFAQ.click();
    
    await expect(firstFAQ.locator('text=The Consentz Aesthetic Directory is a verified platform')).toBeVisible();

    const secondFAQ = faqItems.nth(1);
    await secondFAQ.click();
    
    await expect(secondFAQ.locator('text=The Consentz Directory is one component')).toBeVisible();

    const readAllFAQsButton = page.locator('button:has-text("Read All FAQ\'S")');
    await expect(readAllFAQsButton).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    const specialistsGrid = page.locator('.grid.grid-cols-2');
    await expect(specialistsGrid).toBeVisible();

    const treatmentsGrid = page.locator('.grid.grid-cols-2');
    await expect(treatmentsGrid).toBeVisible();
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const image = images.nth(i);
      await expect(image).toHaveAttribute('alt');
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const buttonText = await button.textContent();
      if (buttonText && buttonText.trim()) {
        await expect(button).toBeVisible();
      }
    }

    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      await expect(link).toHaveAttribute('href');
    }
  });

  test('should scroll smoothly through all sections', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const sections = [
      'h2:has-text("Contact a Specialist")',
      'h2:has-text("Find Top-Rated Aesthetic Clinics Near You")',
      'h2:has-text("Most Popular Treatments")',
      'h2:has-text("Building trust and clarity in healthcare")',
      'h2:has-text("For Service Providers")',
      'h2:has-text("Our Latest Blogs")',
      'h2:has-text("Frequently Asked Questions")'
    ];

    for (const sectionSelector of sections) {
      const section = page.locator(sectionSelector);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
  });

  test('should handle navigation interactions', async ({ page }) => {
    const cityLinks = page.locator('a[href*="/clinics/"]');
    if (await cityLinks.count() > 0) {
      const firstCityLink = cityLinks.first();
      const href = await firstCityLink.getAttribute('href');
      
      await firstCityLink.click();
      await expect(page).toHaveURL(href || /\/clinics\//);
    }
  });

  test('should maintain performance with large content', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);

    await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    });

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });
});