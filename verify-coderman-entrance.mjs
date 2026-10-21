import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5174/');await page.waitForTimeout(1250);await page.screenshot({path:'naming/coderman-entrance-desktop.png'});
await page.waitForTimeout(2500);console.log('Entrance completes:',await page.locator('.cm-intro').count()===0, 'site enabled:',await page.locator('.site').evaluate(e=>!e.inert));await page.screenshot({path:'naming/coderman-character-desktop.png'});
await page.reload();console.log('Repeat visit skips:',await page.locator('.cm-intro').count()===0);
await page.getByRole('button',{name:'Meet Coderman'}).click();await page.keyboard.press('Escape');console.log('Escape returns focus:',await page.getByRole('button',{name:'Meet Coderman'}).evaluate(e=>e===document.activeElement));
await page.getByRole('button',{name:'Meet Coderman'}).click();await page.getByRole('button',{name:'Skip intro'}).click();console.log('Skip enabled site:',await page.locator('.site').evaluate(e=>!e.inert));
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Meet Coderman'}).click();await page.waitForTimeout(1200);await page.screenshot({path:'naming/coderman-entrance-mobile.png'});await page.getByRole('button',{name:'Skip intro'}).click();
for(const width of [320,390,768,1440]) {await page.setViewportSize({width,height:844});console.log('overflow',width,await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));}
await page.getByRole('button',{name:'Explore Plethora',exact:true}).click();await page.keyboard.press('Escape');console.log('Gallery closes:',await page.getByRole('dialog').count()===0);
const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:5174/');console.log('Reduced motion skips:',await reduced.locator('.cm-intro').count()===0);console.log('Reduced motion animations:',await reduced.locator('.cm-body').evaluate(e=>getComputedStyle(e).animationName));console.log('Errors:',errors);await browser.close();
