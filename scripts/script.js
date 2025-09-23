document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector('[class^="exploreSidebar"], [class*=" exploreSidebar"]');
  if (el) el.style.display = "none";
});
