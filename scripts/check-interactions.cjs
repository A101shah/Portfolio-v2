// Test the shipped interaction script with a minimal DOM, without third-party dependencies.
const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
function element(dataset = {}) {
  const attrs = {}, handlers = {}, classes = new Set();
  return {dataset, attrs, hidden:false, textContent:'', handlers,
    setAttribute(k,v){attrs[k]=v;}, addEventListener(k,v){handlers[k]=v;},
    classList:{toggle(k,on){on?classes.add(k):classes.delete(k);}}, classes};
}
const root = element({theme:'dark'}), theme = element();
const filters = ['all','ai','web','data'].map(filter=>element({filter}));
const cards = ['ai','web','data'].map(category=>element({category}));
const copy = element({email:'shahaarav602@gmail.com'}), status=element(), filterStatus=element(), year=element();
const storage={}, writes=[];
const navigator={clipboard:{writeText:async text=>{writes.push(text);}}};
const document={documentElement:root,
 querySelector:s=>s==='.theme-toggle'?theme:s==='.copy-email'?copy:null,
 querySelectorAll:s=>s==='[data-filter]'?filters:s==='[data-category]'?cards:s==='[data-year]'?[year]:[],
 getElementById:s=>s==='copy-status'?status:filterStatus};
vm.runInNewContext(fs.readFileSync('dist/assets/app.js','utf8'),{document,navigator,localStorage:{setItem(k,v){storage[k]=v;}},Date});
(async()=>{
 theme.handlers.click();assert.equal(root.dataset.theme,'light');assert.equal(storage['aarav-theme'],'light');assert.equal(theme.attrs['aria-label'],'Switch to dark theme');
 filters[1].handlers.click();assert.deepEqual(cards.map(c=>c.hidden),[false,true,true]);assert.equal(filterStatus.textContent,'Showing 1 project');assert.equal(filters[1].attrs['aria-pressed'],'true');
 filters[0].handlers.click();assert(cards.every(c=>!c.hidden));assert.equal(filterStatus.textContent,'Showing 3 projects');
 await copy.handlers.click();assert.equal(writes[0],copy.dataset.email);assert.equal(status.textContent,'Email copied.');
 navigator.clipboard.writeText=async()=>{throw new Error('unavailable');};await copy.handlers.click();assert.match(status.textContent,/Select and copy/);
 console.log('PASS: theme persistence, filter visibility and announcements, clipboard success and fallback.');
})().catch(e=>{console.error(e);process.exit(1);});
