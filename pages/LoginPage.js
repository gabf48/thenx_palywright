import { loginLocators } from '../locators/login.locators.js';

/**
 * Page Object representing the Login page.
 */
export class LoginPage {
  /**
   * @param {import('playwright').Page} page - The Playwright page object
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Logs into the application using provided username and password.
   * Accepts cookies, fills credentials, clicks login, and waits for login confirmation.
   * 
   * @param {string} username - The username/email for login
   * @param {string} password - The password for login
   * @returns {Promise<void>}
   */
  async login(username, password) {
    await this.page.waitForSelector(loginLocators.acceptCookies);
    await this.page.click(loginLocators.acceptCookies);
    await this.page.fill(loginLocators.usernameInput, username);
    await this.page.fill(loginLocators.passwordInput, password);
    await this.page.click(loginLocators.loginButton);
    await this.page.waitForSelector(loginLocators.loggedInIndicator);
  }
}
