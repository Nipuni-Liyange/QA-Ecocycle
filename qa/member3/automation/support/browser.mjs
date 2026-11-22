import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Builder, By, until } from 'selenium-webdriver';

const BASE = process.env.M3_BASE_URL || 'http://127.0.0.1:4000';
const TIMEOUT = 20000;

export function assertIsolated() {
  if (process.env.M3_TEST_MODE !== 'isolated') {
    throw new Error('Mutating browser automation is blocked outside the isolated test runner. Use npm run ui or npm run bdd.');
  }
}
export async function browser() {
  assertIsolated();
  return new Builder().forBrowser('firefox').build();
}
export async function navigate(driver, route) {
  await driver.get(new URL(route, BASE).href);
}
export async function visible(driver, locator, timeout = TIMEOUT) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}
export async function routeIs(driver, path) {
  await driver.wait(async () => new URL(await driver.getCurrentUrl()).pathname === path, TIMEOUT);
  assert.equal(new URL(await driver.getCurrentUrl()).pathname, path);
}
export async function badgeIs(driver, status) {
  const badge = await visible(driver, By.css(`.status-badge.status-${status}`));
  assert.equal((await badge.getText()).trim().toLowerCase(), status);
}
export function unique(prefix = 'qa') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
export function account(role = 'user') {
  return { role, name: 'QA Automation Test', email: `${unique(role)}@example.invalid`, password: 'QaAutomation2026!Test' };
}
export async function chooseRole(driver, role) {
  if (role !== 'user') {
    const radio = await driver.findElement(By.css(`input[name="accountRole"][value="${role}"]`));
    // The radio itself may be visually hidden; click its accessible label.
    await radio.findElement(By.xpath('..')).click();
    assert.equal(await radio.isSelected(), true);
  }
}
export async function register(driver, person) {
  assertIsolated();
  await navigate(driver, '/register');
  await visible(driver, By.css('form[aria-label="Register"]'));
  await chooseRole(driver, person.role);
  await driver.findElement(By.name('name')).sendKeys(person.name);
  await driver.findElement(By.name('email')).sendKeys(person.email);
  await driver.findElement(By.name('password')).sendKeys(person.password);
  await driver.findElement(By.name('confirmPassword')).sendKeys(person.password);
  await driver.findElement(By.css('form[aria-label="Register"] button.auth-submit')).click();
  await routeIs(driver, person.role === 'collector' ? '/collector' : '/dashboard');
  await visible(driver, By.css('nav[aria-label="Dashboard navigation"]'));
}
export async function logout(driver) {
  await (await visible(driver, By.css('button.signout'))).click();
  await routeIs(driver, '/login');
}
export async function login(driver, person) {
  await navigate(driver, '/login');
  await visible(driver, By.css('form[aria-label="Login"]'));
  await chooseRole(driver, person.role);
  await driver.findElement(By.name('email')).sendKeys(person.email);
  await driver.findElement(By.name('password')).sendKeys(person.password);
  await driver.findElement(By.css('form[aria-label="Login"] button.auth-submit')).click();
  await routeIs(driver, person.role === 'collector' ? '/collector' : '/dashboard');
  await visible(driver, By.css('nav[aria-label="Dashboard navigation"]'));
}
export async function selectFirstRealOption(driver, name) {
  const select = await visible(driver, By.name(name));
  for (const option of await select.findElements(By.css('option'))) {
    const value = await option.getAttribute('value');
    if (value && value.trim()) {
      await option.click();
      return value;
    }
  }
  throw new Error(`No selectable option for ${name}`);
}
export async function fillDate(driver, name, date) {
  const element = await visible(driver, By.name(name));
  await driver.executeScript((input, value) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, element, date);
  assert.equal(await element.getAttribute('value'), date);
}
export async function createPickup(driver, itemName = unique('qa-item')) {
  assertIsolated();
  await navigate(driver, '/dashboard/requests/new');
  await visible(driver, By.css('form.pickup-form'));
  await selectFirstRealOption(driver, 'category');
  await driver.findElement(By.name('itemName')).sendKeys(itemName);
  await selectFirstRealOption(driver, 'condition');
  await selectFirstRealOption(driver, 'district');
  await driver.findElement(By.name('city')).sendKeys('Matara');
  await driver.findElement(By.name('address')).sendKeys('QA test address only, not a real collection');
  const inTenDays = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await fillDate(driver, 'preferredDate', inTenDays);
  await (await visible(driver, By.xpath('//button[normalize-space(.)="Submit request"]'))).click();
  await driver.wait(async () => /^\/dashboard\/requests\/[a-f0-9]{24}$/i.test(new URL(await driver.getCurrentUrl()).pathname), TIMEOUT);
  await visible(driver, By.xpath(`//h1[normalize-space(.)="${itemName}"]`));
  await badgeIs(driver, 'pending');
  return { itemName, detailPath: new URL(await driver.getCurrentUrl()).pathname };
}
export async function acceptPickup(driver, itemName) {
  assertIsolated();
  await navigate(driver, '/collector/available');
  const row = await visible(driver, By.xpath(`//tr[.//strong[normalize-space(.)="${itemName}"]]`));
  await row.findElement(By.css('a.table-item')).click();
  await visible(driver, By.xpath(`//h1[normalize-space(.)="${itemName}"]`));
  await badgeIs(driver, 'pending');
  await (await visible(driver, By.xpath('//button[normalize-space(.)="Accept request"]'))).click();
  await badgeIs(driver, 'accepted');
}
export async function failureScreenshot(driver, testId) {
  if (!driver) return;
  try {
    const dir = path.resolve('..', 'evidence', 'artifacts');
    await fs.mkdir(dir, { recursive: true });
    const png = await driver.takeScreenshot();
    await fs.writeFile(path.join(dir, `${testId}-failure.png`), png, 'base64');
    console.error(`Failure screenshot saved: ${testId}-failure.png`);
  } catch (error) {
    console.error(`Could not save failure screenshot: ${error.message}`);
  }
}
