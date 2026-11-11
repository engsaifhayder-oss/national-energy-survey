// الصفحة تُجلب من الإنترنت أولاً (لتصل التحديثات فوراً)، والنسخة المخزنة تُستخدم فقط بدون إنترنت
const CACHE='ne-survey-v3';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'no-store'}).then(r=>r.ok&&c.put(f,r)).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  e.respondWith(
    fetch(req,{cache:'no-store'}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}
      return res;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./index.html')))
  );
});
