const KEYS = {
  upNext: "hide_up_next",
  trending: "hide_trending",
  newBestsellers: "hide_new_bestsellers",
};

const storage = {
  get(keys) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys, (res) => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve(res);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  set(items) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(items, () => {
          const err = chrome.runtime.lastError;
          if (err) reject(err);
          else resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  },
};

function getSidebar(root = document) {
  return root.querySelector('[class^="exploreSidebar"], [class*=" exploreSidebar"]') || root;
}

function setHidden(el, hidden) {
  if (!el) return;
  if (hidden) {
    el.setAttribute("data-substack-clutter-hidden", "1");
    el.style.setProperty("display", "none", "important");
  } else if (el.hasAttribute("data-substack-clutter-hidden")) {
    el.removeAttribute("data-substack-clutter-hidden");
    el.style.removeProperty("display");
  }
}

function applyToggles(state, root = document) {
  const sidebar = getSidebar(root);
  if (!sidebar) return;

  const children = sidebar.children;

  // children[0] is search bar
  const upNextEl = children[1];
  const trendingEl = children[2];
  const newBestsellersEl = children[3];

  setHidden(upNextEl, !!state[KEYS.upNext]);
  setHidden(trendingEl, !!state[KEYS.trending]);
  setHidden(newBestsellersEl, !!state[KEYS.newBestsellers]);
}

(async function init() {
  const state = await storage.get(Object.values(KEYS));

  applyToggles(state);

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    const relevant = Object.values(KEYS).some((k) => k in changes);
    if (!relevant) return;

    const next = { ...state };
    for (const [k, v] of Object.entries(changes)) next[k] = v.newValue;
    applyToggles(next);
  });

  setTimeout(() => observer.disconnect(), 15000);
})();
