const CACHE_NAME='town-guide-grade5-final-v2';
const VOCAB_WORDS=['house','park','library','museum','hospital','bus-stop','station','police-station','fire-station','post-office','bookstore','restaurant','supermarket','castle','shrine','temple','church','aquarium','stadium','zoo','amusement-park','convenience-store','elementary-school','junior-high-school','go','straight','turn','right','left','see','block','corner','up','down','bus','taxi','bike','train','lion','elephant','gorilla','rabbit','zebra','giraffe','tiger','monkey'];
const APP_FILES=[
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/app-icon.svg',
  './assets/app-icon-180.png',
  './assets/fonts/NHHandwriting-Medium.otf',
  './assets/town-guide-hero.webp',
  './assets/tourist-watercolor.webp',
  './assets/town-growth-watercolor.webp',
  './assets/facility-library.webp',
  './assets/facility-museum.webp',
  './assets/facility-park.webp',
  './assets/facility-station.webp',
  './assets/facility-aquarium.webp',
  ...VOCAB_WORDS.map(word=>`./assets/vocab-${word}.webp`)
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
