import dns from 'node:dns/promises';
console.log('DNS', await dns.resolve4('codermanstudios.com'));
for(const u of ['https://codermanstudios.com','https://www.codermanstudios.com']){try{const r=await fetch(u,{redirect:'manual',signal:AbortSignal.timeout(10000)});const t=await r.text();console.log(u,r.status,r.headers.get('location'),r.headers.get('server'),'canonical:',t.includes('rel="canonical"'));}catch(e){console.log(u,e.cause?.code||e.message)}}
