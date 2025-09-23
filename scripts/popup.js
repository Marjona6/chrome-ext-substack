const KEYS = {
  upNext: "hide_up_next",
  trending: "hide_trending",
  newBestsellers: "hide_new_bestsellers",
};

document.addEventListener("DOMContentLoaded", () => {
  const upNext = document.getElementById("toggle-upnext");
  const trending = document.getElementById("toggle-trending");
  const newBestsellers = document.getElementById("toggle-new-bestsellers");

  const save = () =>
    chrome.storage.local.set({
      [KEYS.upNext]: upNext.checked,
      [KEYS.trending]: trending.checked,
      [KEYS.newBestsellers]: newBestsellers.checked,
    });

  chrome.storage.local.get(Object.values(KEYS), (stored) => {
    stored = stored || {};
    upNext.checked = !!stored[KEYS.upNext];
    trending.checked = !!stored[KEYS.trending];
    newBestsellers.checked = !!stored[KEYS.newBestsellers];

    upNext.addEventListener("change", save);
    trending.addEventListener("change", save);
    newBestsellers.addEventListener("change", save);
  });
});
