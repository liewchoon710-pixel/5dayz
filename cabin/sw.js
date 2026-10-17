// 木屋求生 · offline cache. The page is network-first so you always get the newest version when online.
const V='mwq-v5';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mwq-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(/supabase\.co$/.test(u.hostname)||u.protocol==='ws:'||u.protocol==='wss:')return;
 const page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
 if(page){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
 const cacheable=u.origin===location.origin||/cdn\.jsdelivr\.net/.test(u.hostname);if(!cacheable)return;
 e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||net}))});
