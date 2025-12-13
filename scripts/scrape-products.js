import { chromium } from 'playwright';
import { LoginPage } from '../pages/LoginPage.js';
import 'dotenv/config';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  await loginPage.open(process.env.URL_LOGIN);

  await loginPage.login(
    process.env.LOGIN_EMAIL,
    process.env.LOGIN_PASSWORD
  );

})();
