self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // PWA 설치 조건을 만족시키기 위한 더미 fetch 이벤트
});
