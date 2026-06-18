/* auth.js - Proteksi sederhana untuk GitHub Pages Ward Intensive
   Catatan: ini cocok untuk prototype/demo. Untuk proteksi produksi, gunakan backend/auth gateway.
*/
(function () {
  const LOGIN_PAGE = "login.html";
  const SESSION_KEY = "ward_intensive_auth";
  const EXPIRY_KEY = "ward_intensive_auth_expiry";
  const USER_KEY = "ward_intensive_user";
  const SESSION_HOURS = 8;

  function getPageName() {
    const last = window.location.pathname.split("/").pop();
    return last || "index.html";
  }

  function getStorageValue(key) {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  function clearAuth() {
    [sessionStorage, localStorage].forEach(store => {
      store.removeItem(SESSION_KEY);
      store.removeItem(EXPIRY_KEY);
      store.removeItem(USER_KEY);
    });
  }

  function isLoggedIn() {
    const token = getStorageValue(SESSION_KEY);
    const expiry = Number(getStorageValue(EXPIRY_KEY) || 0);
    if (token === "ok" && expiry && Date.now() < expiry) return true;
    clearAuth();
    return false;
  }

  function redirectToLogin() {
    const current = getPageName() + window.location.search + window.location.hash;
    window.location.replace(LOGIN_PAGE + "?next=" + encodeURIComponent(current));
  }

  window.logoutWard = function () {
    clearAuth();
    window.location.replace(LOGIN_PAGE);
  };

  window.setWardAuth = function (username, remember) {
    clearAuth();
    const store = remember ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, "ok");
    store.setItem(EXPIRY_KEY, String(Date.now() + SESSION_HOURS * 60 * 60 * 1000));
    store.setItem(USER_KEY, username || "user");
  };

  const publicPages = [LOGIN_PAGE];
  const page = getPageName();
  if (!publicPages.includes(page) && !isLoggedIn()) {
    redirectToLogin();
  }
})();
