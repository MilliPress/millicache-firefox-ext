// Detect dark mode and use appropriate icon
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const iconPath = isDarkMode ? "icon48-dark.png" : "icon48.png";

browser.devtools.panels.create(
  "MilliCache",
  iconPath,
  "panel.html"
);
