import { loginLocators } from '../locators/login.locators.js';

export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async login(username, password) {
    await this.page.waitForSelector(loginLocators.acceptCookies);
    await this.page.click(loginLocators.acceptCookies);
    await this.page.fill(loginLocators.usernameInput, username);
    await this.page.fill(loginLocators.passwordInput, password);
    await this.page.click(loginLocators.loginButton);
    await this.page.waitForSelector(loginLocators.loggedInIndicator);
  }
}