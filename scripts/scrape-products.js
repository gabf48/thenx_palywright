import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import 'dotenv/config';

(async () => {
  const isCI = process.env.CI === 'true'; // detectăm CI/CD

  // 1️⃣ Launch browser
  const browser = await chromium.launch({
    headless: isCI, // headless doar pe CI/CD
    args: isCI
      ? [] // pe CI/CD nu e nevoie de window-size
      : ['--start-maximized'] // pe local browser full screen
  });

  // 2️⃣ Create context
  const context = await browser.newContext({
    viewport: isCI ? { width: 1920, height: 1080 } : null // pe local viewport full screen
  });

  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  let success = false;

  try {
    // 3️⃣ Open login page
    await loginPage.open(process.env.URL_LOGIN);

    // 4️⃣ Login
    await loginPage.login(
      process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD
    );

    // 5️⃣ Aici poți adăuga scraping
    // ex: await scrapeProducts(page);

    success = true;
    console.log('Scraping completed successfully!');
  } catch (error) {
    console.error('Error during scraping:', error);
    success = false;
  } finally {
    // 6️⃣ Închide browserul doar pe CI/CD
    if (isCI) {
      await browser.close();
    } else {
      console.log('Local run: browser remains open for inspection');
    }
  }

  // 7️⃣ Set exit code corect pentru pass/fail
  process.exitCode = success ? 0 : 1;
})();
