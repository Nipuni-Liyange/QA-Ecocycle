import assert from 'node:assert/strict';
import { By } from 'selenium-webdriver';
import {
  account, acceptPickup, badgeIs, browser, createPickup, failureScreenshot,
  login, logout, navigate, register, routeIs, unique, visible,
} from '../support/browser.mjs';

const tests = [
  ['M3-UI01', 'Valid user login displays dashboard', async driver => {
    const user = account('user');
    await register(driver, user);
    await logout(driver);
    await login(driver, user);
    await routeIs(driver, '/dashboard');
    console.log('Dashboard visible and authenticated user navigation present');
  }],
  ['M3-UI02', 'Invalid login shows error and does not authenticate', async driver => {
    await navigate(driver, '/login');
    await visible(driver, By.css('form[aria-label="Login"]'));
    await driver.findElement(By.name('email')).sendKeys(`${unique('unknown')}@example.invalid`);
    await driver.findElement(By.name('password')).sendKeys('WrongPassword2026!');
    await driver.findElement(By.css('form[aria-label="Login"] button.auth-submit')).click();
    const error = await visible(driver, By.css('.form-alert[role="alert"]'));
    assert.match(await error.getText(), /Email or password is incorrect\./i);
    await routeIs(driver, '/login');
    assert.equal((await driver.findElements(By.css('nav[aria-label="Dashboard navigation"]'))).length, 0);
  }],
  ['M3-UI03', 'User creates pending pickup and it persists after refresh', async driver => {
    await register(driver, account('user'));
    const pickup = await createPickup(driver);
    await driver.navigate().refresh();
    await visible(driver, By.xpath(`//h1[normalize-space(.)="${pickup.itemName}"]`));
    await badgeIs(driver, 'pending');
  }],
  ['M3-UI04', 'Collector accepts pending pickup', async driver => {
    await register(driver, account('user'));
    const pickup = await createPickup(driver);
    await logout(driver);
    await register(driver, account('collector'));
    await acceptPickup(driver, pickup.itemName);
  }],
];

if (process.env.M3_TEST_MODE !== 'isolated') {
  throw new Error('Run using npm run ui with the isolated database.');
}

const requestedId = process.env.M3_TEST_ID;

const selectedTests = requestedId
  ? tests.filter(([id]) => id === requestedId)
  : tests;

if (selectedTests.length === 0) {
  throw new Error(`Unknown test ID: ${requestedId}`);
}
let failed = 0;
for (const [id, description, run] of selectedTests) {
  let driver;
  try {
    driver = await browser();
    await run(driver);
    console.log(`PASS ${id}: ${description}`);
  } catch (error) {
    failed++;
    console.error(`FAIL ${id}: ${error.message}`);
    await failureScreenshot(driver, id);
  } finally {
    if (driver) await driver.quit().catch(() => {});
  }
}
console.log(`M3 Selenium result: ${selectedTests.length - failed} passed, ${failed} failed`);
if (failed) process.exitCode = 1;
