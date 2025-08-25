 const puppeteer = require('puppeteer');

 async function takeSnapshot () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://helha.be/");
    // Attendre que le bouton cookie soit présent
    await page.waitForSelector('.CybotCookiebotDialogBodyButton', { visible: true });
    // Cliquer sur le bouton cookie
    await page.click('.CybotCookiebotDialogBodyButton');
    await page.waitForTimeout(1000); // Attendre 1 seconde pour que le cookie soit accepté
    await page.screenshot({ path: 'capture.png' });
    await browser.close();
 }
 
 takeSnapshot();