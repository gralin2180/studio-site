import fs from 'node:fs/promises';
await fs.mkdir('public/character/tools',{recursive:true});
for(const name of ['nodedotjs','flutter','react','unrealengine','unity','blender']){
 const r=await fetch(`https://cdn.simpleicons.org/${name}/b9eee4`);
 if(r.ok){const s=await r.text();if(s.includes('<svg')){await fs.writeFile(`public/character/tools/${name}.svg`,s);console.log(name,'saved');}}else console.log(name,r.status);
}
