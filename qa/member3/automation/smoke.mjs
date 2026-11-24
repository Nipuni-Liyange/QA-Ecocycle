import assert from 'node:assert/strict';
import { Builder, By, until } from 'selenium-webdriver';

let driver;

try {
  driver = await new Builder()
    .forBrowser('firefox')
    .build();

  await driver.get('http://127.0.0.1:4000/login');

  const form = await driver.wait(
    until.elementLocated(By.css('form[aria-label="Login"]')),
    15000
  );

  await driver.wait(
    until.elementIsVisible(form),
    15000
  );

  const heading = await driver.findElement(By.css('h1')).getText();

  assert.equal(heading, 'Welcome back.');

  assert.equal(
    await driver.findElements(By.css('input[name="email"]')).then(x => x.length),
    1
  );

  console.log('PASS: EcoCycle login page loaded successfully');

} catch (error) {
  console.error('FAIL:', error.message);
  process.exitCode = 1;

} finally {
  if (driver) await driver.quit();
}
