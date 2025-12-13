import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import 'dotenv/config';

(async () => {
  const browser = await chromium.launch({
    headless: true,       
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }  
  });

  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    // 2️⃣ Open login page
    await loginPage.open(process.env.URL_LOGIN);

    // 3️⃣ Login
    await loginPage.login(
      process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD
    );


  } catch (error) {
    console.error('Error during scraping:', error);
    process.exitCode = 1; 
  } finally {
    await browser.close();
  }
})();
