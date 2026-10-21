import { chromium } from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5174');
await page.getByRole('button',{name:'Talk to Coderman',exact:true}).click();
await page.getByRole('button',{name:'What does it cost?',exact:true}).click();
await page.getByText('Indicative USD pricing:',{exact:false}).waitFor();
await page.screenshot({path:'naming/coderman-dark-chat.png'});
await page.getByRole('button',{name:'Take a tour'}).click();
for(const section of ['work','services','approach','contact']) {
 if(!await page.locator('#'+section).evaluate(e=>e.classList.contains('guided-section')))throw Error('Tour missing '+section);
 if(section!=='contact')await page.getByRole('button',{name:'Next stop'}).click();
}
await page.getByRole('button',{name:'Finish tour'}).click();
await page.keyboard.press('Escape');
for(const width of [390,320,768]){
 await page.setViewportSize({width,height:844});
 await page.getByRole('button',{name:'Talk to Coderman',exact:true}).click();
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);
 await page.screenshot({path:`naming/coderman-dark-${width}.png`});
 await page.keyboard.press('Escape');
}
await page.route('**/api/chat',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'AI busy. Tour remains available.'})}));
await page.getByRole('button',{name:'Talk to Coderman',exact:true}).click();
await page.getByRole('textbox',{name:'Ask Coderman'}).fill('Hello');await page.getByRole('button',{name:'Send message',exact:true}).click();await page.getByRole('alert').waitFor();
console.log(JSON.stringify({tour:'all four stops pass',mobile:'320,390,768 no overflow',fallback:'pass',errors}));
await browser.close();
