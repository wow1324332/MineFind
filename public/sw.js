self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // PWA 설치 조건을 만족하기 위한 최소한의 fetch 이벤트 리스너
});
