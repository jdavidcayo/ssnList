import puppeteer from 'puppeteer';
import { target } from './config.js';
import * as futils from './fileUtils.js';
import { sendMail } from './mail.js';
import * as schedule from 'node-schedule';

let brokers = [];
const data = [];

const main = async () => {
  let lastMat = await futils.getLastMat('listado.csv');
  lastMat++;

  let noRecordsCount = 0;

  try {
    let newTab;

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(target);

    await page.waitForSelector('#matricula');

    browser.on('targetcreated', async (target) => {
      let productor;

      if (target.type() === 'page') {
        newTab = await target.page();

        productor = await newTab.evaluate(() => {
          const data = [];
          let aux;
          const textNoFoundSelector = '.alert.alert-warning.col-12';

          if (document.querySelector(textNoFoundSelector)) {
            return null;
          }
          aux = document.querySelector('div.panel-heading2.row > div.col-md-4.col-md-offset-2 > h3')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // matricula

          aux = document.querySelector('div.col-md-8.col-md-offset-2 > h3')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // nombre

          aux = document.querySelector('div.row.col-12.alta > div:nth-child(3) > p')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // alta

          aux = document.querySelector('div.titulin_panel.col-12 > div > div:nth-child(3) > p')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // provincia

          aux = document.querySelector('div.titulin_panel.col-12 > div > div:nth-child(5) > p')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // telefono

          aux = document.querySelector('div.titulin_panel.col-12 > div > div:nth-child(6) > p')?.lastChild?.textContent;
          data.push(aux.replace('/t', '').trim()); // mail

          return data;
        });
        newTab.close();
      }

      if (productor == null) {
        console.log(`Mat ${lastMat - 1} not found!`);
        noRecordsCount++;
        console.log('No records count: ', noRecordsCount);
        return null;
      }
      noRecordsCount = 0;
      console.log(productor);
      brokers.push(productor);
      data.push(productor);
    });

    const interval = setInterval(async () => {
      await page.$eval('#matricula', (input) => {
        input.value = '';
      });

      await page.type('#matricula', String(lastMat));
      if (noRecordsCount === 50) return finishProgram(interval, browser, data);
      if (lastMat % 100 === 0) {
        const dataLocal = brokers;
        futils.write(futils.arrayToCSVFormat(dataLocal));
        console.info('Saving data...');
        futils.getLastMat();
        brokers = [];
      }
      lastMat++;

      await page.click('form > div:nth-child(6) > input');
    }, 1000);
  } catch (error) {
    console.log('Re-init scrapper.');
    return main();
  }
}; // main

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 1;
rule.hour = 10;
rule.minute = 0;

schedule.scheduleJob(rule, function () {
  futils.init('listado.csv');
  main();
});

function finishProgram (interval, browser, data) {
  clearInterval(interval);
  browser.close();
  if (data.length === 0) return sendMail();
  sendMail(data);
}