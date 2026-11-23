import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { After, Before, Given, Then, When, Status } from '@cucumber/cucumber';
import { By } from 'selenium-webdriver';
import {
  account, acceptPickup, badgeIs, browser, createPickup,
  fillDate, login, logout, navigate, register, routeIs,
  selectFirstRealOption, unique, visible,
} from '../../support/browser.mjs';

Before(async function ({ pickle }) {
  this.testId = pickle.tags.find(tag => /^@M3-BDD0[1-8]$/.test(tag.name))?.name.slice(1) || 'M3-BDD';
  this.driver = await browser();
});

After(async function ({ result }) {
  if (!this.driver) return;
  try {
    const dir = path.resolve('..', 'evidence', 'artifacts');
    await fs.mkdir(dir, { recursive: true });
    const outcome = result?.status === Status.PASSED ? 'PASS' : 'FAIL';
    const filename = `${this.testId}-${outcome}.png`;
    const screenshot = await this.driver.takeScreenshot();
    await fs.writeFile(path.join(dir, filename), screenshot, 'base64');
    console.log(`Screenshot evidence: ${filename}`);
  } catch (error) {
    console.error(`Screenshot evidence failed for ${this.testId}: ${error.message}`);
    if (result?.status === Status.PASSED) throw error;
  } finally {
    await this.driver.quit().catch(() => {});
  }
});

// BDD01 â€” Login success.
Given('a newly registered General User is signed out', async function () {
  this.person = account('user');
  await register(this.driver, this.person);
  await logout(this.driver);
});
When('the user signs in with valid credentials', async function () {
  await login(this.driver, this.person);
});
Then('the General User dashboard is shown', async function () {
  await routeIs(this.driver, '/dashboard');
  await visible(this.driver, By.css('nav[aria-label="Dashboard navigation"]'));
});

// BDD02 â€” Login rejection.
Given('an unauthenticated visitor opens the login page', async function () {
  await navigate(this.driver, '/login');
  await visible(this.driver, By.css('form[aria-label="Login"]'));
});
When('the visitor submits invalid credentials', async function () {
  await this.driver.findElement(By.name('email')).sendKeys(`${unique('unknown')}@example.invalid`);
  await this.driver.findElement(By.name('password')).sendKeys('WrongPassword2026!');
  await this.driver.findElement(By.css('form[aria-label="Login"] button.auth-submit')).click();
});
Then('the login form shows an authentication error', async function () {
  const error = await visible(this.driver, By.css('.form-alert[role="alert"]'));
  assert.match(await error.getText(), /Email or password is incorrect\./i);
  await routeIs(this.driver, '/login');
  assert.equal((await this.driver.findElements(By.css('nav[aria-label="Dashboard navigation"]'))).length, 0);
});

// BDD03 â€” Pickup creation and persistence.
Given('a newly registered General User is signed in', async function () {
  await register(this.driver, account('user'));
});
When('the user submits a valid pickup request', async function () {
  this.pickup = await createPickup(this.driver);
});
Then('the pickup is displayed with status {string} after refresh', async function (status) {
  await this.driver.navigate().refresh();
  await visible(this.driver, By.xpath(`//h1[normalize-space(.)="${this.pickup.itemName}"]`));
  await badgeIs(this.driver, status);
});

// BDD04 â€” Missing required item name, with all other required fields filled.
Given('a newly registered General User is on the pickup form', async function () {
  await register(this.driver, account('user'));
  await navigate(this.driver, '/dashboard/requests/new');
  await visible(this.driver, By.css('form.pickup-form'));
});
When('the user submits a pickup without an item name', async function () {
  await selectFirstRealOption(this.driver, 'category');
  await selectFirstRealOption(this.driver, 'condition');
  await selectFirstRealOption(this.driver, 'district');
  await this.driver.findElement(By.name('city')).sendKeys('Matara');
  await this.driver.findElement(By.name('address')).sendKeys('QA test address, not an actual pickup');
  const date = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await fillDate(this.driver, 'preferredDate', date);
  const itemName = await this.driver.findElement(By.name('itemName'));
  assert.equal(await itemName.getAttribute('value'), '');
  assert.equal(await this.driver.executeScript('return arguments[0].validity.valueMissing', itemName), true);
  await (await visible(this.driver, By.xpath('//button[normalize-space(.)="Submit request"]'))).click();
});
Then('the request is blocked by required-field validation', async function () {
  await routeIs(this.driver, '/dashboard/requests/new');
  const form = await visible(this.driver, By.css('form.pickup-form'));
  assert.equal(await this.driver.executeScript('return arguments[0].checkValidity()', form), false);
  const itemName = await this.driver.findElement(By.name('itemName'));
  assert.equal(await this.driver.executeScript('return arguments[0].validity.valueMissing', itemName), true);
});

// BDD05 and BDD06 â€” Acceptance and refresh persistence.
Given('a pending pickup exists from a newly registered General User', async function () {
  await register(this.driver, account('user'));
  this.pickup = await createPickup(this.driver);
  await logout(this.driver);
});
Given('a newly registered Recycling Collector is signed in', async function () {
  await register(this.driver, account('collector'));
});
When('the collector accepts that pickup', async function () {
  await acceptPickup(this.driver, this.pickup.itemName);
});
Then('the pickup is displayed with status {string}', async function (status) {
  await badgeIs(this.driver, status);
});

// BDD07 â€” Role-based access control.
When('the General User opens the collector dashboard', async function () {
  await navigate(this.driver, '/collector/available');
});
Then('the General User remains in the user dashboard', async function () {
  await routeIs(this.driver, '/dashboard');
  await visible(this.driver, By.css('nav[aria-label="Dashboard navigation"]'));
});

// BDD08 â€” Logged-out access control.
When('the General User logs out and opens the dashboard', async function () {
  await logout(this.driver);
  await navigate(this.driver, '/dashboard');
});
Then('the visitor is redirected to the login page', async function () {
  await routeIs(this.driver, '/login');
  await visible(this.driver, By.css('form[aria-label="Login"]'));
});
