// 頭痛外来アンケート オフライン用（shoshin・saishin）
// 一度ネットで開けば、以後はネットなしで起動・回答・QR作成ができる。
// ネットがあるときは裏で最新版を取り直し、次に開いたとき新しい版になる。
var CACHE = "hz-forms-v1";
var FILES = [
  "./shoshin.html", "./saishin.html",
  "./shoshin.webmanifest", "./saishin.webmanifest",
  "./icon_shoshin_192.png", "./icon_shoshin_512.png", "./icon_shoshin_180.png",
  "./icon_saishin_192.png", "./icon_saishin_512.png", "./icon_saishin_180.png"
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
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) c.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
