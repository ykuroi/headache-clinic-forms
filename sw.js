// 頭痛外来アンケート オフライン用（shoshin・saishin・医師用スマホ版 doctor_phone・iPad 版 doctor_ipad）
// 一度ネットで開けば、以後はネットなしで起動・回答・QR作成ができる。
// 2026-10-27：ネットがあるときは毎回ネットの最新版を出す（ネットなし・つながらないときだけ保存しておいた版）。
// 以前は保存した版を先に出していたので、更新しても1回目は古い版が出ていた。
var CACHE = "hz-forms-v4";
var FILES = [
  "./shoshin.html", "./saishin.html",
  "./shoshin.webmanifest", "./saishin.webmanifest",
  "./icon_shoshin_192.png", "./icon_shoshin_512.png", "./icon_shoshin_180.png",
  "./icon_saishin_192.png", "./icon_saishin_512.png", "./icon_saishin_180.png",
  // 2026-10-27 医師用スマホ版（別アプリ）
  "./doctor_phone.html", "./doctor_phone.webmanifest",
  "./icon_doctor_192.png", "./icon_doctor_512.png", "./icon_doctor_180.png",
  // 2026-10-31 医師用 iPad 版（別アプリ）
  "./doctor_ipad.html", "./doctor_ipad.webmanifest"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return fetch(e.request, { cache: "no-cache" }).then(function (res) {
      if (res && res.ok) c.put(e.request, res.clone());
      return res;
    }).catch(function () {
      return c.match(e.request, { ignoreSearch: true });
    });
  }));
});
